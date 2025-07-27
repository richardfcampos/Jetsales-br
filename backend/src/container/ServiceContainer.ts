import { IDatabaseService } from '../interfaces/IDatabaseService';
import { IMessageQueueService } from '../interfaces/IMessageQueueService';
import { IWhatsAppService } from '../interfaces/IWhatsAppService';
import { PostgresDatabaseService } from '../services/implementations/PostgresDatabaseService';
import { RabbitMQMessageQueueService } from '../services/implementations/RabbitMQMessageQueueService';
import { BaileysWhatsAppService } from '../services/implementations/BaileysWhatsAppService';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private databaseService?: IDatabaseService;
  private messageQueueService?: IMessageQueueService;
  private whatsAppService?: IWhatsAppService;

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  getDatabaseService(): IDatabaseService {
    if (!this.databaseService) {
      const connectionString = process.env.DATABASE_URL || 'postgres://user:password@db:5432/messages_db';
      this.databaseService = new PostgresDatabaseService(connectionString);
    }
    return this.databaseService;
  }

  getMessageQueueService(): IMessageQueueService {
    if (!this.messageQueueService) {
      const connectionString = process.env.RABBITMQ_URL || 'amqp://rabbitmq';
      this.messageQueueService = new RabbitMQMessageQueueService(connectionString);
    }
    return this.messageQueueService;
  }

  getWhatsAppService(): IWhatsAppService {
    if (!this.whatsAppService) {
      this.whatsAppService = new BaileysWhatsAppService();
    }
    return this.whatsAppService;
  }

  // Method to set custom implementations (useful for testing)
  setDatabaseService(service: IDatabaseService): void {
    this.databaseService = service;
  }

  setMessageQueueService(service: IMessageQueueService): void {
    this.messageQueueService = service;
  }

  setWhatsAppService(service: IWhatsAppService): void {
    this.whatsAppService = service;
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    if (this.databaseService && 'close' in this.databaseService) {
      await (this.databaseService as any).close();
    }
    if (this.messageQueueService) {
      await this.messageQueueService.close();
    }
  }
} 