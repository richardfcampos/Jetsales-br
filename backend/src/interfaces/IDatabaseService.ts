export interface MessageLog {
  jobId: string;
  phone: string;
  message: string;
  status: string;
}

export interface IDatabaseService {
  logMessage(messageLog: MessageLog): Promise<void>;
  updateMessageStatus(jobId: string, status: string): Promise<void>;
} 