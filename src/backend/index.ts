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


// Setup worker to receive requests
export default {
    async fetch(request: any, env: any, ctx: any) {
        return await handle_request(request, env, ctx);
    }
};


// General function to handle API requests, splits into corresponding function
async function handle_request(request: any, env: any, ctx: any) {

    console.log("Request received: " + request.method + " " + request.url + " with context: " + JSON.stringify(ctx));
    // Parse the endpoint
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check the endpoint method, call the corresponding function
    if (request.method == "OPTIONS") {
        return handle_options(request);
    } else if (request.method == "GET") {
        return await handle_get(request, env, ctx, pathname);
    } else if (request.method == "POST") {
        // Post method is used for e.g. uploading files
        return;
    }
    
    // Otherwise, site is not found
    return new Response("Not Found", { status: 404 });
}


// Function to handle connections with OPTIONS method
function handle_options(request: any) {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Origin": "*",
            // TODO: MUST ADD OTHER OPTIONS HERE
        }
    })
}


// Function to handle connections with GET method
async function handle_get(request: any, env: any, ctx:any, pathname: string) {
    // Create an API instance
    const db = new dbAPI(env);

    // Determine what to GET
    if (pathname.startsWith('/tables')) { // TEMPORARY, REMOVE WHEN DEPLOYING
        const tables = await db.initialiseDatabase();
        return new Response("Tables Found: " + tables, { status: 200 });
    } else if (pathname.startsWith('/search')) {
        // Returnt the search method
        return await search(request, env, ctx);
    } else if (pathname.startsWith('/upload')) {
        if (request.method != "POST") {
            return new Response("Method not allowed! Follow the iBaguette Study schema and API documentation for uploading resources.", { status: 405 });
        }

        // If GET and /upload, then return something important e.g token, only upload if correct method...
        return await upload(request, env, ctx);
    }

    return new Response("Not Found", { status: 404 });
}


async function upload(request: any, env: any, ctx: any) {
    if (request.method != "POST") {
        return new Response("Method not allowed! Follow the iBaguette Study schema and API documentation for uploading resources.", { status: 405 });
    }
    return new Response("todo: add the upload functionality here", { status: 501 });

    // look for token/auth in request headers. early return 401 if not found

    // parse the post body according to the schema

    // sanitise and validate the data

    // send data to database and then add to R2 bucket

    // return success or error response

}


async function search(request: any, env: any, ctx: any) {
    return new Response("todo: add search functionality stuff here", { status: 501 });
    // TODO: add sql query to search for resources:


    // parse the query string (this is a GET request) for what to search for

    // validate and return early if invalid

    // do the corresponding sql stuff and get the results

    // return the results in a lovely json format and success of 200 :))

}
