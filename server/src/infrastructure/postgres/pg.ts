import { Client, PoolClient, QueryResult } from 'pg';
import Pool from 'pg-pool';

const ssl =
  process.env.NODE_ENV === 'production'
    ? {
        rejectUnauthorized: false,
      }
    : false;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  max: 20,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  ssl,
});

export async function connect() {
  console.log(`Connecting to postgres db ${process.env.PG_DATABASE}...`);
  try {
    var client = await pool.connect();
  } catch (e) {
    console.error(e);
    return false;
  }

  console.log('Connection finished with no errors.');

  client.release();
}

export async function query(fn: (client: Client & PoolClient) => Promise<QueryResult<any>>) {
  try {
    var client = await pool.connect();
  } catch (e) {
    console.error(e);
    return null;
  }

  const res = fn(client);

  client.release();

  return res;
}
