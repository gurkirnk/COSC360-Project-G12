import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login } from '../modules/auth/login/loginService.js';

import { findUserCredentialsByEmail } from '../modules/auth/authAndUserRepository.js';
import { compare } from 'bcrypt';

vi.mock('../modules/auth/authAndUserRepository.js', () => ({
    findUserCredentialsByEmail: vi.fn(),
}));

vi.mock('bcrypt', () => {
    const compare = vi.fn();
    return {
        compare,
        default: { compare }
    };
});

describe('Login Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
    });

    it('should return user and token for valid credentials', async () => {
        const mockUser = { 
            id: '1', 
            email: 'test@example.com', 
            hashedPassword: 'hashedPassword', 
            name: 'Test User' 
        };
        
        findUserCredentialsByEmail.mockResolvedValue(mockUser);
        compare.mockResolvedValue(true);

        const result = await login({ 
            email: 'test@example.com', 
            password: 'password123' 
        });

        expect(findUserCredentialsByEmail).toHaveBeenCalledWith('test@example.com');
        expect(compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        expect(result).toHaveProperty('token');
        expect(result.user.email).toBe('test@example.com');
    });

});