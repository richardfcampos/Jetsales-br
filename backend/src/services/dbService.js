const { Pool } = require('pg');
const pool = new Pool({
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
});


async function logMessage({ jobId, phone, message, status }) {
  await pool.query(
    `INSERT INTO messages (job_id, phone, message, status) VALUES ($1, $2, $3, $4)
     ON CONFLICT (job_id) DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP`,
    [jobId, phone, message, status]
  );
}

async function updateMessageStatus(jobId, status) {
  await pool.query(
    `UPDATE messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE job_id = $2`,
    [status, jobId]
  );
}

module.exports = { logMessage, updateMessageStatus };
