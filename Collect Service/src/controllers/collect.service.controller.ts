import { Response, Request, NextFunction } from "express";
import Logging from "../Library/logging";
import client from "../database/connect";
import { QueryResult } from "pg";

const createEntryInCollect = async ( req: Request, res: Response, next: NextFunction ) : Promise <Response> =>  {

    const { name, year_of_joining, phone, email, user_id } = req.body;

    const query = "INSERT INTO forms (name, year_of_joining, phone, email, user_id) VALUES($1,$2,$3,$4,$5) RETURNING *";
    const values = [ name, year_of_joining, phone, email, user_id ];

    /** Todo : Validations of the data */
    try {
        let createQueryExecutionResult: QueryResult = await client.query(query, values);
        return res.status(200).json({"success": true, "data": createQueryExecutionResult.rows, "message": null});
    } catch ( err : any ){
        Logging.error(err.message);
        return res.status(404).json({"success": false, "data": null, "message": "Error in posting data to the Database"});
    }

}


export { createEntryInCollect }; 