import Interactions from "./db-interactions";

export default class dbAPI {
    constructor(any) {
        // Create a DB Controller instance
        this.controller = new Interactions(env);
    }

    async initialiseDatabase() {
        // Initialise the DB if it hasnt been already
        this.controller.initialiseDatabase();
    }

}


