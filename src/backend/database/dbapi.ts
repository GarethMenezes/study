import Interactions from "./db-interactions";

export default class dbAPI {
    controller: Interactions;

    constructor(env: any) {
        // Create a DB Controller instance
        this.controller = new Interactions(env);
    }

    async initialiseDatabase() {
        // Initialise the DB if it hasnt been already
        await this.controller.initialiseDatabase();
        let tables : string[] = [];
        const results = await this.controller.getTablesIntegrity();
        for (const result of results)
            tables.push(result.name);
        return tables;
    }

}


