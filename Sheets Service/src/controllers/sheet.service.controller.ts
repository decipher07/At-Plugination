import { Request, Response } from "express";
import { oauth2Client } from '../auth/utils';
import { google } from 'googleapis';
import Logging from "../Library/logging";

const createSpreadSheetController = async (req: Request, res: Response) => {
    const access_token = req.body.access_token as string;
    const title = req.body.title as string;

    oauth2Client.setCredentials({
        access_token: access_token
    })

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
        return res.status(404).json({ "success": false, "data": null, "message": "Error in reading data from database" });
    }
}

const appendSpreadSheetController = async (req: Request, res: Response) => {
    const refresh_token = req.body.access_token as string;

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
            [new Date().toISOString(), "Some value", "Another value"]
        ]
    }

    let data = await doc.spreadsheets.values.append({
        spreadsheetId: "1MzbALtMPw6U7VqDl5NCxU3MhTjBcXt3jQbFeU8JVogU",
        range: 'Sheet1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: resource
    })

    res.json({"data": data});
}

export { createSpreadSheetController, appendSpreadSheetController };