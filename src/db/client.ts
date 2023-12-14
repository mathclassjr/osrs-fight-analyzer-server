import pg from 'pg';
import config from '../config/config.ts';

const client = new pg.Client({
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    host: config.POSTGRESS_HOST,
    database: config.POSTGRES_DB_NAME
});

export default client;