import {Client, Pool} from "pg";
import config from "../config";
import pgvector from 'pgvector/pg';


const pool = new Pool({
    host: config.database.host,
    user: config.database.user,
    database: config.database.database,
    password: config.database.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: config.database.timeout,
    ssl: {
        rejectUnauthorized: config.database.requireSSL
    }
})


pool.on('connect', async function (client) {
    await pgvector.registerType(client);
});
export default pool