export default class Interactions {
    db: any;

    constructor(env: any) {
        // Get the corresponding D1 binding
        if (env.ENVIRONMENT_MODE == "production") {
            this.db = env.resources_db;
        } else {
            this.db = env.DEV_resources_db;
        }
    }


    // Function to check if a prepared SQL statement is malicious
    async SQLPrepare(statement: string, bindings: any[]) {
        // Sanitise bindings
        // binding characters should be only specific characters...
        for (let i = 0; i < bindings.length; i++) {
            let binding: string = (bindings[i]).toString();
            // bindings can contain letters, and a few others
            const allowedChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_!?:;@.,+/=");

            // Ensure bindings only contains these
            for (let i = 0; i < binding.length; i++) {
                if (!allowedChars.has(binding[i])) {
                    return false;
                }
            }
    
            // Also fail against empty bindings
            if (binding.length == 0) {
                return false;
            }
        }

        // Make preparations and apply bindings
        let SQLStatement = this.db.prepare(statement);

        try {
            // Bind each of the bindings
            SQLStatement = SQLStatement.bind.apply(SQLStatement, bindings);

        // Catch any errors that occur
        } catch (e) {
            console.log(e);
            return false;
        }

        // Return the final statement
        return SQLStatement
    }


    // Function to insert into the users database
    async newUser(email: string, username: string, password: string, state: string, language: string) {

        const datetime: number = (Math.floor(Date.now() / 1000));
        const bindings: any[] = [email, password, username, state, "false", language, datetime, datetime];

        const s = await this.SQLPrepare('INSERT INTO "users" ("email","password","username","status","verification-state","language","last-reset-datetime","last-activity-datetime") VALUES (?,?,?,?,?,?,?,?)', bindings);

        if (s == false) {
            return false;
        }

        const insertion = await s.run()
        return insertion;
    }


    // Function to initialise the schema
    async initialiseDatabase() {
        // Note study-schema.sql is a copy of the schema defined here:
        const schema = [
            `CREATE TABLE IF NOT EXISTS "users" ("user-id"	INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT,"email" TEXT,"password" TEXT,"username" TEXT,"status" TEXT NOT NULL,"verification-state" TEXT NOT NULL,"verified-datetime" INTEGER,"language" TEXT NOT NULL,"last-reset-datetime" INTEGER,"last-activity-datetime" INTEGER);`,
            `CREATE TABLE IF NOT EXISTS "feedback" ("feedback-id" INTEGER NOT NULL UNIQUE,"user-id" INTEGER,"submittion-datetime" INTEGER,"content" TEXT NOT NULL,PRIMARY KEY("feedback-id" AUTOINCREMENT),FOREIGN KEY("user-id") REFERENCES "users"("user-id"));`,
            `CREATE TABLE IF NOT EXISTS "uploads" ("upload-id" INTEGER NOT NULL UNIQUE,"user-id" INTEGER NOT NULL,"datetime" INTEGER NOT NULL,"file-count" INTEGER,"title" TEXT NOT NULL,"description" TEXT,"marks" TEXT,"grade" TEXT,"tos" TEXT NOT NULL DEFAULT 'false',"hide-name" TEXT NOT NULL DEFAULT 'true',"watermark" TEXT NOT NULL DEFAULT 'true',"allow-indexing" TEXT NOT NULL DEFAULT 'true',"allow-ai-training" TEXT NOT NULL DEFAULT 'false',"report-analytics" TEXT NOT NULL DEFAULT 'false',"monetise" TEXT NOT NULL DEFAULT 'true',"tier" TEXT,"subject" TEXT,"exam-board" TEXT,"resource-type" TEXT,"path" TEXT NOT NULL,"data" TEXT,PRIMARY KEY("upload-id" AUTOINCREMENT),FOREIGN KEY("user-id") REFERENCES "users"("user-id"));`,
            `CREATE TABLE IF NOT EXISTS "tokens" ("token-id" INTEGER NOT NULL UNIQUE,"user-id" INTEGER,"token" TEXT NOT NULL,"expiration-datetime" INTEGER,"type" TEXT NOT NULL,PRIMARY KEY("token-id" AUTOINCREMENT),FOREIGN KEY("user-id") REFERENCES "users"("user-id"));`
        ];
        
        // Run the schema, this will create the database.
        // Note using "CREATE IF NOT EXISTS" prevents overwriting old data.
        for (const SQLStatement of schema) {
            await this.db.exec(SQLStatement);
        }
    }


    // Function to get all of the tables in the schema
    async getTablesIntegrity(env: any) {
        // Are we on the production environment or development?
        if (env.ENVIRONMENT_MODE == "production") {
            return false; // NOT ALLOWED TO READ THIS TABLE IN PRODUCTION
        }
        // Otherwise, get the data
        const tables = await this.db.prepare("SELECT * FROM sqlite_master WHERE type='table';").all();
        return tables.results;
    }


    // Function to access the tokens table
    async getTokensTable(env: any) {
        // Are we on the production environment or database?
        if (env.ENVIRONMENT_MODE == "production") {
            return false; // NOT ALLOWED TO READ THIS TABLE IN PRODUCTION
        }
        // Otherwise, get the data
        const results = await this.db.prepare('SELECT * FROM "tokens"').all();
        return results.results;
    }


    // Function to access the users table
    async getUsersTable(env: any) {
        // Are we on the production environment or database?
        if (env.ENVIRONMENT_MODE == "production") {
            return false; // NOT ALLOWED TO READ THIS TABLE IN PRODUCTION
        }
        // Otherwise, get the data
        const results = await this.db.prepare('SELECT * FROM "users"').all();
        return results.results;
    }

    // Function to insert a new token into the database
    async newToken(userid: string, token: string, type: string, expiration: number) { 
        const s = await this.SQLPrepare('INSERT INTO "tokens" ("user-id","token","expiration-datetime","type") VALUES (?,?,?,?)', [userid, token, expiration as unknown as string, type])
        if (s == false) {
            return false;
        }
        const insertion = await s.run()
        return insertion;
    }


    // Function to get a list of users matching a sort critiera
    async getUser(email?: string, username?: string, userid?: string) {
        // Create the SQL Query based on the inputs
        let searchCriteria: string = "";
        let bindings: string[] = [];

        // Is there a userid?
        if (typeof userid != "undefined") {
            // If there is create the search query
            searchCriteria = 'WHERE "user-id" = ?';
            bindings.push(userid);
        }

        // If there isnt a user-id a more complex search may be needed
        else {

            if (typeof email != "undefined") {
                searchCriteria = 'WHERE "email" = ?';
                bindings.push(email);
            }

            else if (typeof username != "undefined") {
                searchCriteria = 'WHERE "username" = ?';
                bindings.push(username);
            }

        }

        // Prepare the query
        let SQLStatement: string = 'SELECT * FROM "users" ';
        SQLStatement = SQLStatement.concat(searchCriteria);
        let s = await this.SQLPrepare(SQLStatement, bindings);
        if (s == false) {
            return false;
        }

        // Run the query
        const results = await s.all();
        if (typeof results == "undefined") {
            return undefined;
        }

        // Return its result
        return results.results[0];
    }


    // Function to get the data surrounding a token
    async getToken(token: string) {
        // Get matching tokens
        const s = await this.SQLPrepare('SELECT * FROM "tokens" WHERE "token" = ?;', [token]);
        if (s == false) {
            return false;
        }

        const results = await s.all();

        // Check that the result is valid
        if (results == null) 
            return false;

        if (results.results.length != 1)
            return false;

        // Is the token not expired?
        if ((results.results[0]["expiration-datetime"] as number) <= (Math.floor(Date.now() / 1000) as number)) {
            // Token is expired
            // Delete the entry and return false
            const s = await this.SQLPrepare('DELETE FROM "tokens" WHERE "token" = ?;', [token]);
            if (s == false) {
                return false;
            }
            await s.run();
            return false;
        }

        // Otherwise the token is real and valid
        return true;
    }
}
