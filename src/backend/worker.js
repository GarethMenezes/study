import dbAPI from "./database/dbapi";

// Create an API instance
const db = new dbAPI(env);
        
// Initialise the database if it hasnt been already
db.initialiseDatabase()

