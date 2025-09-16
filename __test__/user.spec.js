import supertest from "supertest";
import app from '../app.js';

let createdUserId; // will store numeric id

describe("Testing users API with numeric id", () => {

    it("GET all users", async () => {
        const response = await supertest(app).get("/users");
        expect(response.status).toBe(200);
        console.log("All users:", response.body);

        expect(Array.isArray(response.body)).toBe(true);
    });

    it("POST a new user", async () => {
        const response = await supertest(app).post("/users").send({
            email: "John@gmail.com",
            username: "johnd",
            password: "m38rmF$",
            name: {
                firstname: "John",
                lastname: "Doe",
            },
            address: {
                city: "kilcoole",
                street: "7835 new road",
                number: 3,
                zipcode: "12926-3874",
                geolocation: {
                    lat: "-37.3159",
                    long: "81.1496",
                },
            },
            phone: "1-570-236-7033",
        });

        expect(response.status).toBe(200);
        console.log("Created user:", response.body);

        // numeric id instead of _id
        expect(response.body).toHaveProperty("id");
        createdUserId = response.body.id; // store numeric id
    }, 30000);

    it("GET a single user by id", async () => {
        const response = await supertest(app).get(`/users/${createdUserId}`);
        expect(response.status).toBe(200);
        console.log("Get user by id:", response.body);

        expect(response.body).not.toStrictEqual({});
        expect(response.body.name).toHaveProperty("firstname");
        expect(response.body.id).toBe(createdUserId);
    }, 30000);

    it("GET users with limit and sort", async () => {
        const response = await supertest(app).get("/users?limit=3&sort=desc");
        expect(response.status).toBe(200);
        console.log("Get users with query string:", response.body);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThanOrEqual(3);
    });

    it("PUT (update) user by id", async () => {
        const response = await supertest(app).put(`/users/${createdUserId}`).send({
            email: "mrk@y.com",
            username: "mrk",
            password: "1234566",
            name: {
                firstname: "Mohammadreza",
                lastname: "Kei",
            },
            address: {
                city: "tehran",
                street: "blv",
                number: 3,
                geolocation: {
                    lat: "123.345354",
                    long: "54.23424",
                },
            },
            phone: "+989123456783",
        });

        expect(response.status).toBe(200);
        console.log("PUT user:", response.body);

        expect(response.body).toHaveProperty("id");
        expect(response.body.id).toBe(createdUserId);
    });

    it("PATCH (partial update) user by id", async () => {
        const response = await supertest(app).patch(`/users/${createdUserId}`).send({
            phone: "+989111111111",
        });

        expect(response.status).toBe(200);
        console.log("PATCH user:", response.body);

        expect(response.body).toHaveProperty("id");
        expect(response.body.id).toBe(createdUserId);
        expect(response.body.phone).toBe("+989111111111");
    });

    it("DELETE user by id", async () => {
        const response = await supertest(app).delete(`/users/${createdUserId}`);
        expect(response.status).toBe(200);
        console.log("DELETE user:", response.body);

        expect(response.body).toHaveProperty("id");
        expect(response.body.id).toBe(createdUserId);
    });

});
