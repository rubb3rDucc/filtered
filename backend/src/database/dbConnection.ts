import { Database } from './types'
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import dotenv from 'dotenv';

dotenv.config();

const dialect = new PostgresDialect({
    pool: new Pool({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DB_NAME,
        port: 5432,
        max: 10,
    })
});

export const client = new Kysely<Database>({
    dialect,
})