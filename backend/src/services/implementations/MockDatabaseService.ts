import { IDatabaseService, MessageLog } from '../../interfaces/IDatabaseService';

export class MockDatabaseService implements IDatabaseService {
  private messages: MessageLog[] = [];

  async logMessage(messageLog: MessageLog): Promise<void> {
    this.messages.push(messageLog);
    console.log('Mock DB: Logged message', messageLog);
  }

  async updateMessageStatus(jobId: string, status: string): Promise<void> {
    const message = this.messages.find(m => m.jobId === jobId);
    if (message) {
      message.status = status;
      console.log('Mock DB: Updated message status', { jobId, status });
    }
  }

  // Test helper methods
  getMessages(): MessageLog[] {
    return [...this.messages];
  }

  clear(): void {
    this.messages = [];
  }
} 