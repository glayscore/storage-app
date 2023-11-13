import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('WarehouseModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST warehouse/add-products', async () => {
    const productToLocation = {
      shelf: 'AA',
      section: 1,
      products: [{ productId: 'L00001 S', quantity: 10 }],
    };

    await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Test Product', code: '00001', price: 10.99 });

    return request(app.getHttpServer())
      .post('/warehouse/add-products')
      .send(productToLocation)
      .expect(200);
  });

  it('/POST warehouse/shelves', async () => {
    const shelf = { code: 'AA' };
    await request(app.getHttpServer())
      .post('/warehouse/shelves')
      .send(shelf)
      .expect(201)
      .then((response) => {
        expect(response.body.code).toEqual(shelf.code);
      });
  });

  it('/POST warehouse/sections', async () => {
    const section = {
      number: 1,
      shelfCode: 'AA',
    };

    await request(app.getHttpServer())
      .post('/warehouse/sections')
      .send(section)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.number).toEqual(section.number);
        expect(response.body.shelf).toHaveProperty('code', section.shelfCode);
      });
  });

  it('/POST warehouse/remove-products', () => {
    const productFromLocation = {
      shelf: 'AA',
      section: 1,
      products: [{ productId: 'L12345 S', quantity: 5 }],
    };
    return request(app.getHttpServer())
      .post('/warehouse/remove-products')
      .send(productFromLocation)
      .expect(200);
  });

  it('/GET warehouse/product-locations/:productId/:quantity', () => {
    const productId = 'L12345 S';
    const quantity = 5;
    return request(app.getHttpServer())
      .get(`/warehouse/product-locations/${productId}/${quantity}`)
      .expect(200)
      .then((response) => {
        const locations = response.body;
        expect(locations).toBeInstanceOf(Array);
        let totalQuantity = 0;
        for (const location of locations) {
          expect(location.productId).toBe(productId);
          totalQuantity += location.quantity;
        }
        expect(totalQuantity).toBeGreaterThanOrEqual(quantity);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
