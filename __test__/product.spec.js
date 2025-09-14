import supertest from "supertest";
import app from '../app.js';

let createdProductId; 

describe("Testing products API", () => {
    it("all products", async () => {
        const response = await supertest(app).get("/products");
        expect(response.status).toBe(200);
        console.log("get", response.body);
        expect(response.body).not.toStrictEqual([]);
    });

    it("post a product", async () => {
        const response = await supertest(app).post("/products").send({
            title: "test",
            price: 13.5,
            description: "test desc",
            image: "test img",
            category: "test cat",
        });
        expect(response.status).toBe(200);
        console.log("post", response.body);

        // mongoose usually returns _id
        expect(response.body).toHaveProperty("_id");

        createdProductId = response.body._id;
    });

    it("get a single product", async () => {
        const response = await supertest(app).get(`/products/${createdProductId}`);
        expect(response.status).toBe(200);
        console.log("get by id", response.body);
        expect(response.body).toHaveProperty("title");
    });

    it("put a product", async () => {
        const response = await supertest(app).put(`/products/${createdProductId}`).send({
            title: "updated test",
            price: 20.0,
            description: "updated desc",
            image: "updated img",
            category: "updated cat",
        });
        expect(response.status).toBe(200);
        console.log("put", response.body);
        expect(response.body).toHaveProperty("_id");
    });

    it("patch a product", async () => {
        const response = await supertest(app).patch(`/products/${createdProductId}`).send({
            price: 25.0,
        });
        expect(response.status).toBe(200);
        console.log("patch", response.body);
        expect(response.body).toHaveProperty("_id");
    });

    it("delete a product", async () => {
        const response = await supertest(app).delete(`/products/${createdProductId}`);
        expect(response.status).toBe(200);
        console.log("delete", response.body);
        expect(response.body).toHaveProperty("_id");
    });
});
