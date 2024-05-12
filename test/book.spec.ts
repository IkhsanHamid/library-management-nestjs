import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BookController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/books/insert', () => {
    it('should be able to add book', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/books/insert')
        .send({
          title: 'unit testing',
          author: 'unit testing',
          stock: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected if request is duplicate', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/books/insert')
        .send({
          title: 'unit testing',
          author: 'unit testing',
          stock: 10,
        });

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
    });
  });

  describe('GET /api/books/get', () => {
    it('should be able to get data', async () => {
      const response = await request(app.getHttpServer()).get('/api/books/get');

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/books/getOne/:id', () => {
    it('should be able to get data', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/books/getOne/KKX-001',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected to get data', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/books/getOne/1000',
      );

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
    });
  });

  describe('PATCH /api/books/update/:id', () => {
    it('shoudl be able to update data', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/books/update/ZHK-005')
        .send({
          title: 'updated book',
          author: 'update author',
          stock: 15,
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected to update data', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/books/update/1000')
        .send({
          title: 'updated book',
          author: 'update author',
          stock: 15,
        });

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
    });
  });

  describe('DELETE /api/books/remove/:id', () => {
    it('should be able to remove data', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/books/remove/ZHK-005',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected to remove data', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/books/remove/10000',
      );

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
    });
  });
});
