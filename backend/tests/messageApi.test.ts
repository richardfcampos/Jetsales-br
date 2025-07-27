import request from 'supertest';
import app from '../src/config/express';
import { ServiceContainer } from '../src/container/ServiceContainer';
import { MockDatabaseService } from '../src/services/implementations/MockDatabaseService';
import { MockMessageQueueService } from '../src/services/implementations/MockMessageQueueService';

jest.mock('../src/config/queue', () => ({
  add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
}));

// Mock the service container
jest.mock('../src/container/ServiceContainer', () => ({
  ServiceContainer: {
    getInstance: jest.fn().mockReturnValue({
      getDatabaseService: jest.fn().mockReturnValue({
        logMessage: jest.fn(),
        updateMessageStatus: jest.fn(),
      }),
      getMessageQueueService: jest.fn().mockReturnValue({
        connect: jest.fn(),
        publishEvent: jest.fn(),
        close: jest.fn(),
      }),
    }),
  },
}));

describe('POST /send-message', () => {
  it('should queue a message and return jobId', async () => {
    const res = await request(app)
      .post('/send-message')
      .send({ phone: '+5511999999999', message: 'Olá, seja bem-vindo(a)!' })
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(202);
    expect(res.body).toHaveProperty('jobId');
    expect(res.body.status).toBe('queued');
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/send-message')
      .send({ phone: '' })
      .set('Accept', 'application/json');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
}); 