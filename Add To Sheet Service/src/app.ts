import amqp, { Channel, ConsumeMessage } from "amqplib";
import Logging from "./Library/logging";
import { google } from 'googleapis';
import { config } from './config/config'

const oauth2Client = new google.auth.OAuth2(
    config.auth.clientId,
    config.auth.clientSecret,
    config.auth.redirectUri
);

const appendSpreadSheetFunction = async (responseid: any, name: any, yearOfJoining: any, phone: any, email: any, userId: any, refresh_token: any, spreadsheetId: any) => {

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
        
        Logging.info(data.data);
        return { "success": true, "data": data.data, "message": null } ;
    } catch (err: any) {
        Logging.error(err.message);
        return { "success": false, "data": null, "message": "Error in writing data to the sheets" };
    }
}

async function consumeMessages(exchangeName: string, queueName: string) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "x-delayed-message", {
        autoDelete: false,
        durable: true,
        // @ts-ignore
        passive: true,
        arguments: {
            'x-delayed-type': "direct"
        }
    });

    const q = await channel.assertQueue(queueName);

    // Queue, Exchange, Queuename
    await channel.bindQueue(q.queue, exchangeName, queueName);

    channel.consume(q.queue, async (msg: ConsumeMessage | null ) => {
        const data = JSON.parse(msg!.content as unknown as string);
        
        const { refresh_token, responseid, name, yearOfJoining, phone, email, userId, spreadsheetId } = data ;
        
        let responseFromAppendingSheetService = await appendSpreadSheetFunction(responseid, name, yearOfJoining, phone, email, userId, refresh_token, spreadsheetId );

        channel.ack(msg!);
    });
}

consumeMessages(config.queue.exchangeName, config.queue.queueName);