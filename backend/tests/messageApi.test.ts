import request from 'supertest';
import app from '../src/config/express';

jest.mock('../src/config/queue', () => ({
  add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
}));
jest.mock('../src/services/dbService', () => ({
  logMessage: jest.fn(),
}));
jest.mock('../src/services/rabbitmqService', () => ({
  publishEvent: jest.fn().mockResolvedValue(undefined),
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