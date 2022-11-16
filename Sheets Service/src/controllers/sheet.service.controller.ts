import { Request, Response } from "express";
import { oauth2Client } from '../auth/utils';
import { google } from 'googleapis';
import { config } from '../config/config'
import Logging from "../Library/logging";
import sheetProducer from "../common/producerSheet.queue";

const createSpreadSheetController = async (req: Request, res: Response) => {
    const title = req.body.title as string;
    const refresh_token = req.body.refresh_token as string;

    oauth2Client.setCredentials({
        refresh_token: refresh_token
    })

    oauth2Client.refreshAccessToken((err, tokens: any) => {
        if (err) return console.error(err)

        oauth2Client.setCredentials({
            access_token: tokens.access_token
        })
    });

    const doc = google.sheets({ version: "v4", auth: oauth2Client });
    const resource = {
        properties: {
            title,
        },
    };

    try {
        const spreadsheet = await doc.spreadsheets.create({
            requestBody: resource,
            fields: 'spreadsheetId'
        })

        return res.json({ "success": true, "data": spreadsheet.data.spreadsheetId, "message": null });
    } catch (err: any) {
        Logging.error(err.message);
        return res.status(404).json({ "success": false, "data": null, "message": "Error in creating data in Sheets" });
    }
}

const appendSpreadSheetController = async (req: Request, res: Response) => {
    const refresh_token = req.body.refresh_token as string;
    const { responseid, name, yearOfJoining, phone, email, userId } = req.body;
    const spreadsheetId = req.body.spreadsheetId;

    /**
     try {
         
         oauth2Client.setCredentials({
             refresh_token: refresh_token
         })
     
         oauth2Client.refreshAccessToken((err, tokens: any) => {
             if (err) return console.error(err)
     
             oauth2Client.setCredentials({
                 access_token: tokens.access_token
             })
         });
     
         const doc = google.sheets({ version: "v4", auth: oauth2Client });
         
         const resource = {
             values: [
                 [ responseid, name, yearOfJoining, phone, email, userId ]
             ]
         }
     
         let data = await doc.spreadsheets.values.append({
             spreadsheetId: spreadsheetId,
             range: 'Sheet1',
             valueInputOption: 'RAW',
             insertDataOption: 'INSERT_ROWS',
             requestBody: resource
         })
     
         res.json({ "success": true, "data": data.data, "message": null });
     } catch (err: any) {
         Logging.error(err.message);
         return res.status(404).json({ "success": false, "data": null, "message": "Error in writing data to the sheets" });
     }
     * 
     */
    
    await sheetProducer.publishMessage(config.queue.exchangeName, config.queue.queueName, req.body);

    return res.sendStatus(200);
}

export { createSpreadSheetController, appendSpreadSheetController };