const { Pool } = require('pg');

const POOL = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

POOL.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

POOL.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = POOL;
