import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('MemberController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /api/members/insert', () => {
    it('should be rejected if request is duplicate', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/members/insert')
        .send({
          name: 'unit testing',
        });
      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
    });

    it('should be able to add member', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/members/insert')
        .send({
          name: 'completed',
        });
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/members/get', () => {
    it('should be able to get data', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/members/get',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/members/getOne/:id', () => {
    it('should be able to get data', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/members/getOne/M001',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected to get data', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/members/getOne/1000',
      );

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
    });
  });

  describe('PATCH /api/members/update/:id', () => {
    it('should be able to update data', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/members/update/M005')
        .send({
          name: 'unit testing updated',
        });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected to update data', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/members/update/1000')
        .send({
          name: 'unit testing updated',
        });
      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
    });
  });

  describe('DELETE /api/members/remove/:id', () => {
    it('should be able to remove data', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/members/remove/M005',
      );
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should be rejected to remove data', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/members/remove/1000',
      );
      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
    });
  });
});
