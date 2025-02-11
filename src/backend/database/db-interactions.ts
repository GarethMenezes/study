export default class Interactions {
    db: any;

    constructor(env) {
        this.db = env.DEV_resources_db; // Get the D1 binding 
    }


    // Function to insert a new token into the database
    async newToken(userid: number, token: string, type: string, expiration: number) {        
        const insertion = await this.db.prepare('INSERT INTO "user-tokens" ("user-id","token","expiration-datetime","type") VALUES (?,?,?,?)').bind(userid, token, expiration, type);
        return await insertion.run();
    }


    // Function to get the data surrounding a token
    async getToken(token: string) {
        const results = await this.db.prepare('SELECT * FROM "user-tokens" WHERE "token" = ?;').bind(token).all();

        // Check that the result is valid
        if (results == null) 
            return false;

        if (results.results.length != 1)
            return false;

        // Is the token not expired?
        if (results.results[0].expiration <= Math.floor(Date.now() / 1000))
            // Token is expired
            // Delete the entry and return false
            await this.db.prepare('DELETE FROM "user-tokens" WHERE "token" = ?;').run();
            return false;

        // Otherwise the token is real and valid
        return true;
    }


    // Function to get all of the tables in the schema
    async getTablesIntegrity() {
        const tables = await this.db.prepare("SELECT * FROM sqlite_master WHERE type='table';").all();
        return tables.results;
    }


    // Function to initialise the schema
    async initialiseDatabase() {
        // Note study-schema.sql is a copy of the schema defined here:
        const schema = [
            `CREATE TABLE IF NOT EXISTS "users" ("user-id"	INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT,"email" TEXT,"password" TEXT,"username" TEXT,"status" TEXT NOT NULL,"verification-state" TEXT NOT NULL,"verified-datetime" INTEGER,"language" TEXT NOT NULL,"last-reset-datetime" INTEGER,"last-activity-datetime" INTEGER);`,
            `CREATE TABLE IF NOT EXISTS "feedback" ("feedback-id" INTEGER NOT NULL UNIQUE,"user-id" INTEGER,"submittion-datetime" INTEGER,"content" TEXT NOT NULL,PRIMARY KEY("feedback-id" AUTOINCREMENT),FOREIGN KEY("user-id") REFERENCES "users"("user-id"));`,
            `CREATE TABLE IF NOT EXISTS "uploads" ("upload-id" INTEGER NOT NULL UNIQUE,"user-id" INTEGER NOT NULL,"auth-token" INTEGER NOT NULL,"datetime" INTEGER NOT NULL,"file-count" INTEGER,"title" TEXT NOT NULL,"description" TEXT,"marks" TEXT,"grade" TEXT,"tos" TEXT NOT NULL DEFAULT 'false',"hide-name" TEXT NOT NULL DEFAULT 'true',"watermark" TEXT NOT NULL DEFAULT 'true',"allow-indexing" TEXT NOT NULL DEFAULT 'true',"allow-ai-training" TEXT NOT NULL DEFAULT 'false',"report-analytics" TEXT NOT NULL DEFAULT 'false',"monetise" TEXT NOT NULL DEFAULT 'true',"tier" TEXT,"subject" TEXT,"exam-board" TEXT,"resource-type" TEXT,"path" TEXT NOT NULL,"data" TEXT,PRIMARY KEY("upload-id" AUTOINCREMENT),FOREIGN KEY("user-id") REFERENCES "users"("user-id"));`,
            `CREATE TABLE IF NOT EXISTS "user-tokens" ("token-id" INTEGER NOT NULL UNIQUE,"user-id" INTEGER,"file-id" INTEGER,"token" TEXT NOT NULL,"expiration-datetime" INTEGER,"type" TEXT NOT NULL,PRIMARY KEY("token-id" AUTOINCREMENT),FOREIGN KEY("user-id") REFERENCES "users"("user-id"));`
        ];
        
        // Run the schema, this will create the database.
        // Note using "CREATE IF NOT EXISTS" prevents overwriting old data.
        for (const statement of schema)
            await this.db.exec(statement);
    }

}