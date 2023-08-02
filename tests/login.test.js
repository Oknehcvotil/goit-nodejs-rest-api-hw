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
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const { DB_HOST } = process.env;

const ctrl = require("../controllers/auth");

const testUser = {
  email: "test@gmail.com",
  password: "123456",
};

describe("test login", () => {
  let connection;
  let db;
  let server;

  beforeAll(async () => {
    connection = await MongoClient.connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = await connection.db();
    
    const users = db.collection("users");

    const hashPassword = await bcrypt.hash(testUser.password, 10);

    await users.insertOne({ ...testUser, password: hashPassword });

    mongoose
      .connect(DB_HOST)
      .then(() => {
        server = app.listen(7880);
      })
      .catch((error) => {
        console.log(error.message);
        process.exit(1);
      });
  });

  afterAll(async () => {
    await db.collection("users").deleteMany({});
    await connection.close();     
    await mongoose.disconnect(DB_HOST).then(() => {
      server.close();
    });
  });

  test("login", async () => {
    const res = await request(app)
      .post("/api/users/login", ctrl.login)
      .send(testUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toMatchObject({
      user: {
        email: expect.any(String),
        subscription: expect.any(String),
      },
    });
  }, 10000);
});
