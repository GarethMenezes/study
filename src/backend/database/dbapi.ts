import Interactions from "./db-interactions";


export default class dbAPI {
    controller: Interactions;

    constructor(env: any) {
        // Create a DB Controller instance
        this.controller = new Interactions(env);
    }
    

    // Function to check if an email is valid
    async validateEmail(email: string) {

        // Must have "@"
        if (!email.includes("@"))
            return false;

        // Ensure there is only one "@"
        const parts = email.split("@");
        if (parts.length != 2)
            return false;

        // Split it into before the "@" and after
        const [local, domain] = parts;

        // Both sides must exist
        if (local.length == 0 || domain.length == 0)
            return false;


        // Domain part must have a "."
        if (!domain.includes("."))
            return false;

        // Split the domain section by the "."
        const domainParts = domain.split(".");

        // Both parts must exist
        if (domainParts[0].length == 0 || domainParts[1].length == 0)
            return false;

        // If this passes, then the domain "looks" valid
        return true;
    }


    // Function to validate a uniform input (has no spaces). This is for usernames, passwords, etc.
    async validateUniformInput(username: string) {
        // Usernames can contain letters, - and _
        const allowedChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_!?:;@.,");

        // Ensure username only contains these
        for (let i = 0; i < username.length; i++) {
            if (!allowedChars.has(username[i]))
                return false;
        }

        // Otherwise, it is valid
        return true;

    }


    // Function to clean up the tokens database, this will remove all expired tokens for a user
    async cleanTokens(userid: string) {
        return await this.controller.cleanTokens(userid);
    }


    // Function to compare a password with a hash
    async verifyPassword(password: string, hash: string) {

        // Split the hash into the salt and key
        const [saltBase64, derivedKeyBase64] = hash.split(".");

        // Decode the salt back into an array
        const saltBinary = atob(saltBase64);
        const salt = Uint8Array.from(saltBinary, char => char.charCodeAt(0));

        // Use the salt to encode the password that the user provided
        // This is the same as the other algorithm, except the salt is predefined
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        // Create key

        const passwordKeyMaterial = await crypto.subtle.importKey(
            "raw",
            passwordBuffer,
            { name: "PBKDF2" },
            false,
            ["deriveBits"]);
    
        const passwordDerivedKey = await crypto.subtle.deriveBits({
                name: "PBKDF2",
                salt,
                iterations: 100000, // Max 100000, Ensure this matches the hashing algorithm
                hash: "SHA-256"},
                passwordKeyMaterial,
                256);

        const passwordCheck = btoa(String.fromCharCode(...new Uint8Array(passwordDerivedKey)));

        // Compare the passwords new hash with the stored derived key
        // MUST be strictly equal
        return passwordCheck === derivedKeyBase64;
    }
  

    // Function to hash a password
    async hashPassword(password: string) {
        // Set up to hash
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);
        const salt = crypto.getRandomValues(new Uint8Array(16));

        // Create key

        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            passwordBuffer,
            { name: "PBKDF2" },
            false,
            ["deriveBits"]);
    
        const derivedKey = await crypto.subtle.deriveBits({
                name: "PBKDF2",
                salt,
                iterations: 100000, // Max 100000
                hash: "SHA-256"},
                keyMaterial,
                256);

        const saltBase64 = btoa(String.fromCharCode(...(salt)));
        const derivedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(derivedKey)));

        const hash = `${saltBase64}.${derivedKeyBase64}`;

        return hash;
    }


    // Function to get a single users record from the database by their username
    async getUserByUsername(user: string) {
        return await this.controller.getUser(undefined, user, undefined);
    }


    // Function to get a single users record from the database by their user-id
    async getUserByUserID(id: string) {
        return await this.controller.getUser(undefined, undefined, id);
    }


    // Function to get a single users record from the database by their email
    async getUserByEmail(email: string) {
        return await this.controller.getUser(email, undefined, undefined);
    }


    // Function to validate if a user exists
    async validateUser(userid?: string, username?: string) {
        // User the controllers get user to determine if it exists
        if (typeof userid != "undefined") {
            return await this.controller.getUser(undefined, undefined, userid);
        }

        if (typeof username != "undefined") {
            return await this.controller.getUser(undefined, username, undefined);
        } 

        // If neither, return false
        return false;
    }


    // Function to register a new user in the database
    async newUserRegister(email: string, username: string, password: string) {
        // Check that a user with this email doesnt already exist
        let results = await this.controller.getUser(email, undefined, undefined);
        if (typeof results != "undefined") {
            return "INVALID-EMAIL";
        }

        // Check that a user with this username doesnt already exist
        results = await this.controller.getUser(undefined, username, undefined);
        if (typeof results != "undefined") {
            if(results.length > 0) {
                return "INVALID-USERNAME";
            }
        }
    
        // User does not already exist!

        // Validate the email
        // Oliver -- 13.02.2025 - do these need to be awaited? (!(await this.validateEmail(email)))
        if (!this.validateEmail(email)) {
            return "INVALID-EMAIL";
        }

        // Validate the username
        if (!this.validateUniformInput(username)) {
            return "INVALID-USERNAME";
        }

        // Validate the password
        if (!this.validateUniformInput(password)) {
            return "INVALID-PASSWORD";
        }
        
        // Hash the password
        const hashedPassword: string = await this.hashPassword(password);

        // Create entry for the user
        const success = await this.controller.newUser(email, username, hashedPassword, "VERIFYING", "en");

        if (success == false) {
            return "FAILED";
        }

        // If the user was added successfully
        return true;
    }


    // Function to create the database and return an array of tables
    async initialiseDatabase(env: any) {
        // Initialise the DB if it hasnt been already
        await this.controller.initialiseDatabase();
        let message : string[] = [];

        // Get tables
        const tables = await this.controller.getTablesIntegrity(env);
        
        // Get tokens
        const tokens = await this.controller.getTokensTable(env);

        // Get users
        const users = await this.controller.getUsersTable(env);

        // Prepare output
        if (env.ENVIRONMENT_MODE == "development") {
            // Append the datetime epoch for debugging
            message.push("\n Current Epoch: ")
            message.push(Math.floor(Date.now() / 1000) as unknown as string)

            // Output the tokens found
            message.push("\n Tokens:    ")
            if (tokens != false) {
                for (const result of tokens) {
                    message.push((result["user-id"]) as string);
                    message.push("-");
                    message.push(result.token);
                    message.push("-");
                    message.push((result["expiration-datetime"]) as string);
                    message.push("-");
                    message.push((result.type) as string);
                message.push(", ");
                }
            } else {
                message.push("NO ACCESS OR NO DATA");
            }

            // Output the tables found
            message.push("\n Tables:    ")
            if (tables != false) {
                for (const result of tables) {
                    message.push(result.name);
                    message.push(", ");
                }
            } else {
                message.push("NO ACCESS OR NO DATA");
            }

            // Output the users found
            message.push("\n Users:    ")
            if (users != false) {
                for (const result of users) {
                    message.push((result["user-id"]) as string);
                    message.push("-");
                    message.push(result.email);
                    message.push("-");
                    message.push((result.username) as string);
                    message.push("-");
                    message.push((result.status) as string);
                message.push(", ");
                }
            } else {
                message.push("NO ACCESS OR NO DATA");
            }

            return message;
        } else {
            return false;
        }
    }


    // Function to validate a users token exists
    async validateToken(token: string) {

        // Sanity check input
        if (typeof token == "undefined") {
            return false;
        }

        if (token.length == 0) {
            return false;
        }

        const result = await this.controller.getToken(token);

        // Return if the token was found
        return result;
    }


    // Function to generate a token for a user
    async generateToken(userid: string, type: string) {

        // Verify that the user exists
        if (await this.getUserByUsername(userid) == false)
            return false;

        // Generate a token
        // Create an array of hexadecimal values 32 elements long
        const array = new Uint8Array(32);

        // Populate it with random values
        crypto.getRandomValues(array);

        // Build the token using the values
        let token = '';
        for (let i = 0; i < array.length; i++) {
            // Pad each value, after converting to hex, to ensure it is 2 characters wide 
            token += array[i].toString(16).padStart(2, '0');
        }
        
        // Define the expiration, tokens will expire after 1 hour
        const expiration = Math.floor(Date.now() / 1000) + 3600

        // Create an entry in the database with the token, user-id, type and expiration
        const success = await this.controller.newToken(userid, token, type, expiration);

        // If it was not successful then return false
        if (success == false) {
            return false;
        }

        // Otherwise return the token
        return token;
    }

}
