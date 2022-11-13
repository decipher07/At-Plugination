import { Client } from "pg";
import Logging from "../Library/logging";
import { config } from "../config/config"

/** Connect to Postgres */
const client = new Client({
    user: config.postgres.username,
    host: config.postgres.hostname,
    database: config.postgres.database,
    password: config.postgres.password,
    port: config.postgres.port
})

client.connect( (err: Error) => {
    if ( err )
        throw err ;
    
    Logging.info("Database Connected!");
})

export default client;