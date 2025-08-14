const POOL = require('../../conection.js')

async function postgresQuery() {

  try {

    const response = await POOL.query(`SELECT NOW() AT TIME ZONE 'America/Mexico_City' AS local_time`);
    //console.log('Server time:', response.rows[0].now);

    const localTime = response.rows[0].local_time;

    const formatted = new Date(localTime).toLocaleString('sv-SE', {
      hour12: false
    }).replace('T', ' ');

    return {status: 200, time: formatted};

  } catch (err) {

    console.error('DB query error:', err);

    return {status: 500, message: "Query error"};
  }
}

module.exports = { postgresQuery };