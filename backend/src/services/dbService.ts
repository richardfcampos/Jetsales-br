import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface MessageLog {
  jobId: string;
  phone: string;
  message: string;
  status: string;
}

export async function logMessage({ jobId, phone, message, status }: MessageLog): Promise<void> {
  await pool.query(
    `INSERT INTO messages (job_id, phone, message, status) VALUES ($1, $2, $3, $4)
     ON CONFLICT (job_id) DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP`,
    [jobId, phone, message, status]
  );
}

export async function updateMessageStatus(jobId: string, status: string): Promise<void> {
  await pool.query(
    `UPDATE messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE job_id = $2`,
    [status, jobId]
  );
}
 