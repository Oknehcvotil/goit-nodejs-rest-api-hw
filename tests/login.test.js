const {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
} = require("@jest/globals");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const { DB_HOST } = process.env;

const testUser = {
  email: "test@gmail.com",
  password: "123456",
};

describe("test login", () => {
  let userRes;
  let server;

  beforeAll(async () => {
    mongoose
      .connect(DB_HOST)
      .then(() => {
        server = app.listen(7888);
      })
      .catch((error) => {
        console.log(error.message);
        process.exit(1);
      });

    await request(app).post("/api/users/register").send(testUser);
  });

  afterAll(async () => {
    await request(app)
      .delete("/api/users/current")
      .set("Authorization", `Bearer ${userRes.body.token}`);
    await mongoose.disconnect(DB_HOST).then(() => {
      server.close();
    });
  });

  test("should login when request is ok", async () => {
    userRes = await request(app).post("/api/users/login").send(testUser);

    expect(userRes.status).toBe(200);
    expect(userRes.body).toHaveProperty("token");
    expect(userRes.body).toMatchObject({
      user: {
        email: expect.any(String),
        subscription: expect.any(String),
      },
    });
  }, 10000);

  test("should report error when email doesn't exists", async () => {
    const res = await request(app).post("/api/users/login").send({
      password: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.error.text).toMatch('{"message":"\\"email\\" is required"}');
  }, 10000);

  test("should report error when email is wrong", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "Wrongtest@gmail.com",
      password: "123456",
    });

    expect(res.status).toBe(401);
    expect(res.error.text).toMatch("Email or password is wrong");
  }, 10000);

  test("should report error when password doesn't exists", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "Wrongtest@gmail.com",
    });

    expect(res.status).toBe(400);
    expect(res.error.text).toMatch('{"message":"\\"password\\" is required"}');
  }, 10000);

  test("should report error when password is wrong", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.error.text).toMatch("Email or password is wrong");
  }, 10000);

  test("should report error when password and email doesn't exists", async () => {
    const res = await request(app).post("/api/users/login");

    expect(res.status).toBe(400);
    expect(res.error.text).toMatch('{"message":"\\"password\\" is required"}');
  }, 10000);
});
