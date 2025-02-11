import Interactions from "./db-interactions";


export default class dbAPI {
    controller: Interactions;

    constructor(env: any) {
        // Create a DB Controller instance
        this.controller = new Interactions(env);
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

        // Output the tokens found
        message.push("\n Tokens:    ")
        if (tokens != false) {
            for (const result of tokens) {
                message.push((result.user) as string);
                message.push("-");
                message.push(result.token);
                message.push("-");
                message.push((result.expiration) as string);
                message.push(", ");
            }
        } else {
            message.push("NO ACCESS");
        }

        // Output the tables found
        message.push("\n Tables:    ")
        if (tables != false) {
            for (const result of tables) {
                message.push(result.name);
                message.push(", ");
            }
        } else {
            message.push("NO ACCESS");
        }

        return message;
    }


    // Function to validate a users token exists
    async validateToken(token: string) {

        // Sanity check input
        if (token.length == 0) {
            return false;
        }

        const result = await this.controller.getToken(token);

        // Return if the token was found
        return result;
    }


    // Function to generate a token for a user
    async generateToken(userid: number, type: string) {

        // TODO: Validate that the user exists
        // NO METHOD OF ADDING USERS YET

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
        return success;
    }

}
