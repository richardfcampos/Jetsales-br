export interface IMessageQueueService {
  connect(): Promise<void>;
  publishEvent(queue: string, message: unknown): Promise<void>;
  close(): Promise<void>;
} 