import supertest from 'supertest';
import app from '../app.js';

let createdCartId;

describe('Cart API', () => {
  // Create a fresh cart before tests
  beforeAll(async () => {
    const res = await supertest(app).post('/carts').send({
      userId: 999,
      date: '2020-10-10',
      products: [{ productId: 1, quantity: 5 }]
    });
    createdCartId = res.body.id;
  });

  it('should get all carts', async () => {
    const response = await supertest(app).get('/carts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a single cart by ID', async () => {
    const response = await supertest(app).get(`/carts/${createdCartId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).not.toHaveProperty('_id');
  });

  it('should get carts in a date range with limit & sort', async () => {
    const response = await supertest(app).get(
      '/carts?limit=2&sort=desc&startdate=2019-12-10&enddate=2025-10-10'
    );
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(2);
  });

  it('should get carts for a user in date range', async () => {
    const response = await supertest(app).get(
      `/carts/user/999?startdate=2019-12-10&enddate=2025-10-10`
    );
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should add a new cart', async () => {
    const response = await supertest(app).post('/carts').send({
      userId: 1000,
      date: '2025-01-01',
      products: [
        { productId: 2, quantity: 4 },
        { productId: 3, quantity: 1 },
      ],
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  it('should update (PUT) a cart', async () => {
    const response = await supertest(app).put(`/carts/${createdCartId}`).send({
      userId: 999,
      date: '2025-02-01',
      products: [{ productId: 2, quantity: 10 }],
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdCartId);
    expect(response.body.userId).toBe(999);
  });

  it('should partially update (PATCH) a cart', async () => {
    const response = await supertest(app).patch(`/carts/${createdCartId}`).send({
      products: [{ productId: 5, quantity: 7 }],
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdCartId);
    expect(response.body.products[0]).toHaveProperty('productId', 5);
  });

  it('should delete a cart', async () => {
    const response = await supertest(app).delete(`/carts/${createdCartId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('cart');
  });
});
