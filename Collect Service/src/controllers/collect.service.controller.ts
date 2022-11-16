import { Response, Request, NextFunction } from "express";
import { QueryResult } from "pg";
import Logging from "../Library/logging";
import client from "../database/connect";
import collectServiceProducer from "../common/producerCollect.queue";
import { config } from "../config/config";

const createEntryInCollect = async ( req: Request, res: Response, next: NextFunction ) : Promise <Response> =>  {
    const { name, yearOfJoining, phone, email, userId, refresh_token, spreadsheetId } = req.body;

    const query = "INSERT INTO forms (name, year_of_joining, phone, email, user_id) VALUES($1,$2,$3,$4,$5) RETURNING *";
    const values = [ name, yearOfJoining, phone, email, userId ];

    /** Todo : Validations of the data */
    try {
        // let createQueryExecutionResult: QueryResult = await client.query(query, values);

        /** Todo: Push the req.body to the Collect Queue */
        
        /** Temp Changes made */
        // Catch: add the auto incremented response_id 
        req.body.responseid = 11;
        collectServiceProducer.publishMessage(config.queue.exchangeName, config.queue.queueName, req.body);

        return res.status(200).json({"success": true, "data": "createQueryExecutionResult.rows", "message": null});
    } catch ( err : any ){
        Logging.error(err.message);
        return res.status(404).json({"success": false, "data": null, "message": "Error in posting data to the Database"});
    }

}

const readEntryInCollect = async ( req: Request, res: Response, next: NextFunction ) : Promise <Response> => {
    const response_id : string = req.params.response_id;

    const query = "SELECT * FROM forms WHERE response_id=$1";
    const values = [ response_id ];

    try {
        let readQueryExecutionResult: QueryResult = await client.query(query, values);
        return res.status(200).json({"success": true, "data": readQueryExecutionResult.rows, "message": null});
    } catch ( err : any ){
        Logging.error(err.message);
        return res.status(404).json({"success": false, "data": null, "message": "Error in reading data from database"});
    }
}

/** Current Situation: Keeping updates to name for the data */
const updateEntryInCollect = async ( req: Request, res: Response, next: NextFunction ) : Promise <Response> => {
    const response_id : number = req.body.response_id;
    const name: string = req.body.name;

    const query = "UPDATE forms SET name=$1 WHERE response_id=$2";
    const values = [ name, response_id ];

    try {
        let readQueryExecutionResult: QueryResult = await client.query(query, values);
        return res.status(200).json({"success": true, "data": readQueryExecutionResult.rows, "message": null});
    } catch ( err : any ){
        Logging.error(err.message);
        return res.status(404).json({"success": false, "data": null, "message": "Error in reading data from database"});
    }
}

/** Current Situation: Keeping updates to name for the data */
const deleteEntryInCollect = async ( req: Request, res: Response, next: NextFunction ) : Promise <Response> => {
    const response_id : number = req.body.response_id;

    const query = "DELETE FROM forms WHERE response_id=$1";
    const values = [ response_id ];

    try {
        let readQueryExecutionResult: QueryResult = await client.query(query, values);
        return res.status(200).json({"success": true, "data": (readQueryExecutionResult.rowCount > 1 ? "Successful": "No Entry Exist"), "message": null});
    } catch ( err : any ){
        Logging.error(err.message);
        return res.status(404).json({"success": false, "data": null, "message": "Error in reading data from database"});
    }
}


export { createEntryInCollect, readEntryInCollect, updateEntryInCollect, deleteEntryInCollect };