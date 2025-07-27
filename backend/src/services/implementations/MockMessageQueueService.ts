import { IMessageQueueService } from '../../interfaces/IMessageQueueService';

export class MockMessageQueueService implements IMessageQueueService {
  private events: Array<{ queue: string; message: unknown }> = [];

  async connect(): Promise<void> {
    console.log('Mock MQ: Connected');
  }

  async publishEvent(queue: string, message: unknown): Promise<void> {
    this.events.push({ queue, message });
    console.log('Mock MQ: Published event', { queue, message });
  }

  async close(): Promise<void> {
    console.log('Mock MQ: Closed');
  }

  // Test helper methods
  getEvents(): Array<{ queue: string; message: unknown }> {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
} 