const request = require('supertest');
const app = require('../index'); // Adjust the import path based on your app setup
const mongoose = require('mongoose');
require('dotenv').config();

describe('Auth API', () => {
  let token;

  beforeAll(async () => {

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await request(app)
    .post('/auth/register')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
      name: 'Test User',
      bio: 'This is a test user',
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropCollection('users');
    await mongoose.connection.close();
  });

  test('POST /auth/register should register a new user', async () => {
    const newUser = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      bio: 'Bio of New User',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  test('POST /auth/login should login an existing user and return a token', async () => {
    const user = {
      email: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(user);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  test('GET /auth/user should return user details if token is valid', async () => {
    const response = await request(app)
      .get('/auth/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('email', 'testuser@example.com');
  });

  test('GET /auth/validate-token should validate the token', async () => {
    const response = await request(app)
      .get('/auth/validate-token')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Token is valid');
  });

  test('GET /auth/user should return 401 if token is missing', async () => {
    const response = await request(app).get('/auth/user');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Authorization token required');
  });

  test('GET /auth/validate-token should return 401 if token is missing', async () => {
    const response = await request(app).get('/auth/validate-token');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Authorization token required');
  });

  test('POST /auth/login should return 400 for invalid credentials', async () => {
    const invalidUser = {
      email: 'wronguser@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(invalidUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });
});
