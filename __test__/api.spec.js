// __tests__/api.spec.js
import supertest from 'supertest';
import app from '../app.js';

let createdUserId, createdProductId, createdCartId;

describe("🔹 User API Tests", () => {
  it("GET /users - get all users", async () => {
    const res = await supertest(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /users - add new user", async () => {
    const res = await supertest(app).post("/users").send({
      email: "john@example.com",
      username: "john123",
      password: "secret123",
      name: { firstname: "John", lastname: "Doe" },
      address: { city: "City", street: "Street", number: 1, zipcode: "12345", geolocation: { lat: "0", long: "0" } },
      phone: "1234567890"
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdUserId = res.body.id;
  });

  it("GET /users/:id - get single user", async () => {
    const res = await supertest(app).get(`/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toHaveProperty("firstname");
  });

  it("GET /users/:id - user not found", async () => {
    const res = await supertest(app).get("/users/9999");
    expect(res.status).toBe(404);
  });

  it("PUT /users/:id - update full user", async () => {
    const res = await supertest(app).put(`/users/${createdUserId}`).send({
      email: "updated@example.com",
      username: "updatedUser",
      password: "newpass123",
      name: { firstname: "Updated", lastname: "User" },
      address: { city: "NewCity", street: "NewStreet", number: 2, zipcode: "54321", geolocation: { lat: "1", long: "1" } },
      phone: "0987654321"
    });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("updatedUser");
  });

  it("PATCH /users/:id - partial update", async () => {
    const res = await supertest(app).patch(`/users/${createdUserId}`).send({ phone: "1112223333" });
    expect(res.status).toBe(200);
    expect(res.body.phone).toBe("1112223333");
  });

  it("DELETE /users/:id - delete user", async () => {
    const res = await supertest(app).delete(`/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });
});

describe("🔹 Product API Tests", () => {
  it("GET /products - all products", async () => {
    const res = await supertest(app).get("/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /products - add new product", async () => {
    const res = await supertest(app).post("/products").send({
      title: "Test Product",
      price: 100,
      description: "Description",
      image: "img.jpg",
      category: "test"
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdProductId = res.body.id;
  });

  it("GET /products/:id - get single product", async () => {
    const res = await supertest(app).get(`/products/${createdProductId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title");
  });

  it("GET /products/:id - not found", async () => {
    const res = await supertest(app).get("/products/9999");
    expect(res.status).toBe(404);
  });

  it("PUT /products/:id - update full product", async () => {
    const res = await supertest(app).put(`/products/${createdProductId}`).send({
      title: "Updated Product",
      price: 200,
      description: "Updated desc",
      image: "updated.jpg",
      category: "updated"
    });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Product");
  });

  it("PATCH /products/:id - partial update", async () => {
    const res = await supertest(app).patch(`/products/${createdProductId}`).send({ price: 250 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(250);
  });

  it("DELETE /products/:id - delete product", async () => {
    const res = await supertest(app).delete(`/products/${createdProductId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("product");
  });
});

describe("🔹 Cart API Tests", () => {
  it("GET /carts - all carts", async () => {
    const res = await supertest(app).get("/carts");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /carts - add new cart", async () => {
    const res = await supertest(app).post("/carts").send({
      userId: createdUserId,
      date: new Date(),
      products: [{ productId: createdProductId, quantity: 5 }]
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdCartId = res.body.id;
  });

  it("GET /carts/:id - single cart", async () => {
    const res = await supertest(app).get(`/carts/${createdCartId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("userId");
  });

  it("GET /carts/user/:userid - carts for user", async () => {
    const res = await supertest(app).get(`/carts/user/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("PUT /carts/:id - update cart", async () => {
    const res = await supertest(app).put(`/carts/${createdCartId}`).send({
      userId: createdUserId,
      date: new Date(),
      products: [{ productId: createdProductId, quantity: 10 }]
    });
    expect(res.status).toBe(200);
    expect(res.body.products[0].quantity).toBe(10);
  });

  it("PATCH /carts/:id - partial update", async () => {
    const res = await supertest(app).patch(`/carts/${createdCartId}`).send({
      products: [{ productId: createdProductId, quantity: 15 }]
    });
    expect(res.status).toBe(200);
    expect(res.body.products[0].quantity).toBe(15);
  });

  it("DELETE /carts/:id - delete cart", async () => {
    const res = await supertest(app).delete(`/carts/${createdCartId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("cart");
  });
});

describe("🔹 User API Invalid Inputs", () => {
  it("POST /users - missing required fields", async () => {
    const res = await supertest(app).post("/users").send({});
    expect(res.status).toBe(400);
  });

  it("POST /users - invalid email", async () => {
    const res = await supertest(app).post("/users").send({
      email: "invalid-email",
      username: "user1",
      password: "password123",
      name: { firstname: "Test", lastname: "User" }
    });
    expect(res.status).toBe(400);
  });

  it("POST /users - short password", async () => {
    const res = await supertest(app).post("/users").send({
      email: "user@test.com",
      username: "user2",
      password: "123",
      name: { firstname: "Test", lastname: "User" }
    });
    expect(res.status).toBe(400);
  });

  it("GET /users/:id - non-existent user", async () => {
    const res = await supertest(app).get("/users/9999");
    expect(res.status).toBe(404);
  });

  it("PUT /users/:id - non-existent user", async () => {
    const res = await supertest(app).put("/users/9999").send({
      email: "test@test.com",
      username: "userX",
      password: "password123",
      name: { firstname: "X", lastname: "Y" }
    });
    expect(res.status).toBe(404);
  });

  it("PATCH /users/:id - non-existent user", async () => {
    const res = await supertest(app).patch("/users/9999").send({ phone: "12345" });
    expect(res.status).toBe(404);
  });

  it("DELETE /users/:id - non-existent user", async () => {
    const res = await supertest(app).delete("/users/9999");
    expect(res.status).toBe(404);
  });
});

describe("🔹 Product API Invalid Inputs", () => {
  it("POST /products - missing fields", async () => {
    const res = await supertest(app).post("/products").send({});
    expect(res.status).toBe(400);
  });

  it("POST /products - negative price", async () => {
    const res = await supertest(app).post("/products").send({
      title: "Invalid Product",
      price: -10,
      description: "Desc",
      image: "img.jpg",
      category: "test"
    });
    expect(res.status).toBe(400);
  });

  it("GET /products/:id - non-existent product", async () => {
    const res = await supertest(app).get("/products/9999");
    expect(res.status).toBe(404);
  });

  it("PUT /products/:id - non-existent product", async () => {
    const res = await supertest(app).put("/products/9999").send({
      title: "Updated",
      price: 10,
      description: "Desc",
      image: "img.jpg",
      category: "cat"
    });
    expect(res.status).toBe(404);
  });

  it("PATCH /products/:id - non-existent product", async () => {
    const res = await supertest(app).patch("/products/9999").send({ price: 20 });
    expect(res.status).toBe(404);
  });

  it("DELETE /products/:id - non-existent product", async () => {
    const res = await supertest(app).delete("/products/9999");
    expect(res.status).toBe(404);
  });
});

describe("🔹 Cart API Invalid Inputs", () => {
  it("POST /carts - missing userId", async () => {
    const res = await supertest(app).post("/carts").send({ products: [{ productId: 1, quantity: 2 }] });
    expect(res.status).toBe(400);
  });

  it("POST /carts - missing products", async () => {
    const res = await supertest(app).post("/carts").send({ userId: 1 });
    expect(res.status).toBe(400);
  });

  it("POST /carts - negative quantity", async () => {
    const res = await supertest(app).post("/carts").send({
      userId: 1,
      products: [{ productId: 1, quantity: -5 }]
    });
    expect(res.status).toBe(400);
  });

  it("POST /carts - invalid date", async () => {
    const res = await supertest(app).post("/carts").send({
      userId: 1,
      date: "invalid-date",
      products: [{ productId: 1, quantity: 2 }]
    });
    expect(res.status).toBe(400);
  });

  it("GET /carts/:id - non-existent cart", async () => {
    const res = await supertest(app).get("/carts/9999");
    expect(res.status).toBe(404);
  });

  it("PUT /carts/:id - non-existent cart", async () => {
    const res = await supertest(app).put("/carts/9999").send({
      userId: 1,
      products: [{ productId: 1, quantity: 5 }]
    });
    expect(res.status).toBe(404);
  });

  it("PATCH /carts/:id - non-existent cart", async () => {
    const res = await supertest(app).patch("/carts/9999").send({
      products: [{ productId: 1, quantity: 3 }]
    });
    expect(res.status).toBe(404);
  });

  it("DELETE /carts/:id - non-existent cart", async () => {
    const res = await supertest(app).delete("/carts/9999");
    expect(res.status).toBe(404);
  });
});
