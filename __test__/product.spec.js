import supertest from "supertest";
import app from '../app.js';

let createdProductId; // Will store our numeric id

describe("Testing products API with numeric id", () => {

    it("GET all products", async () => {
        const response = await supertest(app).get("/products");
        expect(response.status).toBe(200);
        console.log("GET all:", response.body);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("POST a product", async () => {
        const response = await supertest(app).post("/products").send({
            title: "test product",
            price: 13.5,
            description: "test description",
            image: "test img",
            category: "test category",
        });

        expect(response.status).toBe(200);
        console.log("POST:", response.body);

        // Check that numeric id exists
        expect(response.body).toHaveProperty("id");
        createdProductId = response.body.id; // ✅ store numeric id
    });

    it("GET single product by id", async () => {
        const response = await supertest(app).get(`/products/${createdProductId}`);
        expect(response.status).toBe(200);
        console.log("GET by id:", response.body);

        expect(response.body).toHaveProperty("title");
        expect(response.body.id).toBe(createdProductId);
    });

    it("PUT (update) product by id", async () => {
        const response = await supertest(app).put(`/products/${createdProductId}`).send({
            title: "updated product",
            price: 20.0,
            description: "updated desc",
            image: "updated img",
            category: "updated category",
        });

        expect(response.status).toBe(200);
        console.log("PUT:", response.body);

        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe("updated product");
    });

    it("PATCH (partial update) product by id", async () => {
        const response = await supertest(app).patch(`/products/${createdProductId}`).send({
            price: 25.0,
        });

        expect(response.status).toBe(200);
        console.log("PATCH:", response.body);

        expect(response.body).toHaveProperty("id");
        expect(response.body.price).toBe(25.0);
    });

    it("DELETE product by id", async () => {
        const response = await supertest(app).delete(`/products/${createdProductId}`);
        expect(response.status).toBe(200);
        console.log("DELETE:", response.body);

        expect(response.body).toHaveProperty("id");
        expect(response.body.id).toBe(createdProductId);
    });

});
