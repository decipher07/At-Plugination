import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3001;
const GOOGLE_CLIENT_ID : string = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET : string = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI : string = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3001/auth/redirect"

const EXCHANGE_NAME : string = process.env.EXCHANGE_NAME || 'sheetsExchange';
const QUEUE_NAME : string = process.env.EXCHANGE_NAME || 'sheetsQueue';

const COLLECT_SERVICE_EXCHANGE_NAME : string = process.env.COLLECT_SERVICE_EXCHANGE_NAME || 'collectExchange';
const COLLECT_SERVICE_QUEUE_NAME : string = process.env.COLLECT_SERVICE_QUEUE_NAME || 'collectQueue';

export const config = {
    server: {
        port: SERVER_PORT
    },
    auth: {
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        redirectUri: GOOGLE_REDIRECT_URI
    },
    queue: {
        exchangeName: EXCHANGE_NAME,
        queueName: QUEUE_NAME
    },
    collectQueue: {
        exchangeName: COLLECT_SERVICE_EXCHANGE_NAME,
        queueName: COLLECT_SERVICE_QUEUE_NAME
    }
};