import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST products', () => {
    const product = { name: 'New Product', code: 'L12345 S', price: 100 };
    return request(app.getHttpServer())
      .post('/products')
      .send(product)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining(product));
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
