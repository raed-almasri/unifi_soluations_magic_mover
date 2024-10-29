const request = require("supertest");
const app = require("../../src/app").default;
describe("Auth E2E", () => {
    let token;

    it("should login an existing user and get a token", async () => {
        const res = await request(app).post("/auth").send({
            email: "raed.almasri210201@gmail.com",
            password: "Test@1234",
        });
        expect(res.status).toBe(200);
        token = res.body.result.token;
    });
});
module.exports = { done: "done" };
