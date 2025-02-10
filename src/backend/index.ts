import dbAPI from "./database/dbapi";


/**
 *  Bindings:
 * - The D1 database name is 'resources-db'
 * - The R2 storage bucket name is 'resources_bucket'
 * This can be checked in the 'wrangler.json' file
 */ 


/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
    async fetch(request: any, env: any, ctx: any) {
        // Create an API instance
        const db = new dbAPI(env);
                
        // Initialise the database if it hasnt been already
        db.initialiseDatabase();

        return new Response('Hello World!');

        /** D1 Integration Info
         * 
         * D1 database is 'env.DB', where "DB" is the binding name from the `wrangler.toml / wrangler.json` file. (in this case, `resources_db`)
         * const someVariable = `Bs Beverages`;
         * const stmt = env.DB.prepare("SELECT * FROM Customers WHERE CompanyName = ?").bind(someVariable);
         * 
         * 
         */

    },
};