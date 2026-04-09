import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { loginController } from '../modules/auth/login/loginController.js';

vi.mock('../modules/auth/login/loginService.js', () => ({
    login: vi.fn(),
}));

import { login } from '../modules/auth/login/loginService.js';

describe('Login Controller', () => {
    let app;

    beforeEach(() => {
        vi.clearAllMocks();
        app = express();
        app.use(express.json());
        app.post('/login', loginController);
    });

    it("should login successfully with valid credentials", async () => {
        const mockResult = { user: { id: '1', name: 'Test User' }, token: 'token123' };
        login.mockResolvedValue(mockResult);

        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Logged in successfully');
        expect(response.body.data).toEqual(mockResult);
        expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    });

    it("should return error for invalid credentials", async () => {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        login.mockRejectedValue(error);

        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password.');
    });

    it("should return error for missing fields", async () => {
        const error = new Error('Email and password are required.');
        error.statusCode = 400;
        login.mockRejectedValue(error);

        const response = await request(app)
            .post('/login')
            .send({ password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email and password are required.');
    });
});
