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
    async SQLPrepare(statement: string, bindings: string[]) {

        // Sanitise bindings
        // binding characters should be only "a-z", "A-Z", "0-9", "-" or "_"
        for (const binding of bindings) {
            for (let i = 0; i < binding.length; i++) {
                if (binding.charCodeAt(i) >= 48 && binding.charCodeAt(i) <= 57) {
                    // Character is "0-9"
                    continue;
                }

                if (binding.charCodeAt(i) >= 65 && binding.charCodeAt(i) <= 90) {
                    // Character is "A-Z"
                    continue;
                }

                if (binding.charCodeAt(i) >= 97 && binding.charCodeAt(i) <= 122) {
                    // Character is "a-z"
                    continue;
                }

                if (binding.charCodeAt(i) == 95) {
                    // Character is "_"
                    continue;
                }

                if (binding.charCodeAt(i) == 45) {
                    // Character is "-"
                    continue;
                }

                // If the character hasnt continued, then it is invalid
                return false;
            }
        }

        // Make preparations and apply bindings
        const SQLStatement = this.db.prepare(statement)

        try {
            // Bind each of the bindings
            SQLStatement.bind(bindings);
        } catch (e) {
            return false;
        }

        // Return the final statement
        return SQLStatement
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
        const results = await this.db.prepare('SELECT * FROM "tokens";').all();
        return results.results;
    }


    // Function to insert a new token into the database
    async newToken(userid: number, token: string, type: string, expiration: number) { 
        const s = await this.SQLPrepare('INSERT INTO "tokens" ("user-id","token","expiration-datetime","type") VALUES (?,?,?,?)', [userid as unknown as string, token, expiration as unknown as string, type])
        if (s == false) {
            return false;
        }
        const insertion = await s.run()
        return insertion;
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
