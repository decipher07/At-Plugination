import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

const PGUSER=process.env.PGUSER || '';
const PGHOST=process.env.PGHOST || '';
const PGPASSWORD=process.env.PGPASSWORD || '';
const PGDATABASE=process.env.PGDATABASE || '';
const PGPORT=process.env.PGPORT ? Number(process.env.PGPORT) : 5432;

export const config = {
    server: {
        port: SERVER_PORT
    },
    postgres: {
        username: PGUSER,
        hostname: PGHOST,
        password: PGPASSWORD,
        database: PGDATABASE,
        port: PGPORT
    }
};