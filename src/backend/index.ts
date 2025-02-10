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


async function handle_upload(request: any, env: any, ctx: any) {
    return new Response("todo: add the upload functionality here", { status: 501 });

    // look for token/auth in request headers. early return 401 if not found

    // parse the post body according to the schema

    // sanitise and validate the data

    // send data to database and then add to R2 bucket

    // return success or error response

}

async function search(request: any, env: any, ctx: any) {
    return new Response("We are searching", { status: 200 });

    // TODO: add sql query to search for resources:


    // parse the query string (this is a GET request) for what to search for

    // validate and return early if invalid

    // do the corresponding sql stuff and get the results

    // return the results in a lovely json format and success of 200 :))

}


export default {
    async fetch(request: any, env: any, ctx: any) {
        // // Create an API instance
        // const db = new dbAPI(env);
                
        // // Initialise the database if it hasnt been already
        // db.initialiseDatabase();

        // Parse the endpoint
        const url = new URL(request.url);
        const pathname = url.pathname;

        // Check the endpoint
        if (pathname.startsWith('/search')) {
            return search(request, env, ctx);
        } else if (pathname.startsWith("/upload")) {
            return handle_upload(request, env, ctx);
        }

        return new Response("Not Found", { status: 404 });

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

// end 
