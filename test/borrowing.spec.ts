import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BorrowingController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/borrowing/insert', () => {
    it('should be able to add borrow', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/borrowing/insert')
        .send({
          memberId: 'M002',
          bookId: 'VIO-003',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected if > 2 borrow', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/borrowing/insert')
        .send({
          memberId: 'M002',
          bookId: 'VIO-003',
        });

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
    });
  });

  describe('GET /api/borrowing/get', () => {
    it('should be able to get data', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/borrowing/get',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/borrowing/getOne/:id', () => {
    it('should be able to get data', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/books/borrowing/1',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected to get data', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/books/borrowing/1000',
      );

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
    });
  });

  describe('PATCH /api/borrowing/update/:id', () => {
    it('shoudl be able to update data', async () => {
      const response = await request(app.getHttpServer()).patch(
        '/api/borrowing/update/1',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected to update data', async () => {
      const response = await request(app.getHttpServer()).patch(
        '/api/borrowing/update/1000',
      );

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
    });
  });

  describe('DELETE /api/borrowing/remove/:id', () => {
    it('should be able to remove data', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/borrowing/remove/2',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected to remove data', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/borrowing/remove/10000',
      );

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
    });
  });
});
