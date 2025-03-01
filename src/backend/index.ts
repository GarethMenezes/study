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
        return await handle_post(request, env, ctx, pathname);
    }
    
    // Otherwise, site is not found
    return generate_api_response("Not Found", 404, true, "not_found");
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

    // Determine what to GET
    if (pathname.startsWith('/tables')) {
        // Create an API instance
        const db = new dbAPI(env);

        // Get the data
        const data = await db.initialiseDatabase(env);
        
        // Development mode check
        if (!data) {
            return generate_api_response("Cannot access this site in production!", 403, true, "no_access");
        }
        
        // If we are, then prepare the data
        // Concatenate it together
        let message : string = "";
        for (const dat of data) {
            message = message.concat(dat)
        }

        // Provide it back
        return new Response("Tables Found: " + message, { status: 200 });

    } else if (pathname.startsWith('/search')) {
        // Return the search method
        return await search(request, env, ctx);
    }

    // Otherwise, No data found
    return generate_api_response("Not Found", 404, true, "not_found");
}


// Function to handle connections with POST method
async function handle_post(request: any, env: any, ctx:any, pathname: string) {
    // Evaluate and match the endpoint
    if (pathname.startsWith('/upload')) {
        return await upload(request, env, ctx);
    } else if (pathname.startsWith('/search')) {
        return await search(request, env, ctx);
    } else if (pathname.startsWith('/users/register')) {
        return await new_user_register(request, env, ctx);
    } else if (pathname.startsWith('/users/login')) {
        return await user_login(request, env, ctx);
    }

    // For all other routes, it was unknown/unimplemented
    return generate_api_response("Not Found", 404, true, "not_found");
}


async function upload(request: any, env: any, ctx: any) {
    const db = new dbAPI(env);
    const requestData = await request.json();
    const Authorisation: any = requestData.Authorisation;

    // First validate the users token
    if (!requestData.hasOwnProperty("Authorisation")) {
        return generate_api_response("No authorisation token provided.", 401, true, "AUTH_MISSING");
    };

    if (!(await db.validateToken(Authorisation))) {
        return generate_api_response("Authentication is invalid, please sign in again.", 401, true, "AUTH_INVALID");
    }

    // GENERATING A TEST TOKEN - NOTE THIS IS NOT COMPLETE AND WILL DENY TOKEN CREATION DUE TO SQL CONSTRAINTS
    // const token = await db.generateToken(0, "TEST-TOKEN");

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


// Function to handle a user logging in
async function user_login(request: any, env: any, ctx: any) {
    const db = new dbAPI(env);

    // Break the json into the data submitted
    const { username, password } = await request.json();

    // User can log in with EITHER username or email
    // First check if a user exists with that username
    let user:string = username;
    let record = (await db.getUserByUsername(user));
    
    // If the user is not found, search for the username as an email...
    if (typeof record == "undefined") {
        record = (await db.getUserByEmail(user));

        // If it still does not exist...
        if (typeof record == "undefined") {
            // User record does not exist
            return generate_api_response("INVALID-DETAILS", 406, false);
        }

    }

    // At this point, a record has been found for the user

    // Check the users password
    if (!(await db.verifyPassword(password, record["password"]))) {
        // If it is wrong...
        return generate_api_response("INVALID-DETAILS", 406, false);
    }

    // Clean up previous expired user tokens
    await db.cleanTokens(record["user-id"]);
    
    // Generate the user a token
    const token = await db.generateToken(record["user-id"], "USER-ACCESS");

    // Return basic details of the user and their token

    const result = {
        Username: record["username"],
        Authorisation: token,
        Language: record["language"],
        Status: record["status"],
        Email: record["email"]
    };

    return generate_api_response(JSON.stringify(result), 202, false);
}


// Function to handle creating a new user
async function new_user_register(request:any, env:any, ctx:any) {
    const db = new dbAPI(env);

    // Break the json into the data submitted
    const { email, username, password} = await request.json();

    // Pass it to the dbAPI
    const success = await db.newUserRegister(email, username, password);

    // Check if it was added successfully
    if (success != true) {
        // If it wasnt, return an error message
        if (success != "FAILED") {
            return await generate_api_response(success, 400, true, success);
        } else {
            return await generate_api_response(success, 500, true, success);
        }
    }

    // If it was added succesfully, then get the record
    let user:string = username;
    const record = (await db.getUserByUsername(user));
    
    // Record will exist, we just added it
    const id = record["user-id"];

    // Generate a token for that user
    const token = await db.generateToken(id, "USER-ACCESS");

    // Validate that the token was made
    if (token == false) {
        return await generate_api_response("Failed to generate token", 500, true, "Could not generate token for new user in new_user_register");
    }

    // Respond with the token if successfull
    return await generate_api_response(token, 201, false);

}

/**
 * Generates a neat response to be sent back to the client
 * @param client_message The human-readable text to be shown on the client device (if implemented).
 * @param is_error If the response is an error or not.
 * @param error_code (Optional) Error code that will be used by client code to match to a specific error.
 * @returns the JSON object as a string to be sent to the client as a response.
 */
async function generate_api_response(client_message: string, http_status: number, is_error: boolean, error_code?: string)
{
    let to_return: any = {};

    if (is_error && error_code == undefined) {
        throw new Error("Error code must be provided if the response is an error.");
    }

    if (is_error) {
        to_return = {
            error: true,
            message: client_message,
            error_code: error_code
        }
    } else {
        to_return = {
            error: false,
            message: client_message
        }
    }
    
    return new Response(JSON.stringify(to_return), { status: http_status });
}
