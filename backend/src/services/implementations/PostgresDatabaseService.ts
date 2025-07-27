import { Pool } from 'pg';
import { IDatabaseService, MessageLog } from '../../interfaces/IDatabaseService';

export class PostgresDatabaseService implements IDatabaseService {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async logMessage(messageLog: MessageLog): Promise<void> {
    await this.pool.query(
      `INSERT INTO messages (job_id, phone, message, status) VALUES ($1, $2, $3, $4)
       ON CONFLICT (job_id) DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP`,
      [messageLog.jobId, messageLog.phone, messageLog.message, messageLog.status]
    );
  }

  async updateMessageStatus(jobId: string, status: string): Promise<void> {
    await this.pool.query(
      `UPDATE messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE job_id = $2`,
      [status, jobId]
    );
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
} 