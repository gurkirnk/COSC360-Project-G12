import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { signup } from '../modules/auth/signup/signupService';
import { findUserByEmail, findUserByName, createUser } from '../modules/auth/authAndUserRepository';
import { saveImageAndReturnUrl } from '../modules/images/imageService';
import { normalizePicture } from '../utils/images';


vi.mock('../modules/auth/authAndUserRepository', () => ({
    findUserByEmail: vi.fn(),
    findUserByName: vi.fn(),
    createUser: vi.fn()
}));
vi.mock('../modules/images/imageService', () => ({
    saveImageAndReturnUrl: vi.fn()
}));
vi.mock('../utils/images', () => ({
    normalizePicture: vi.fn()
}));

describe('Sign-up Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();

    });

    it('should return user and token for valid input', async () => {
        findUserByEmail.mockResolvedValue(null);
        findUserByName.mockResolvedValue(null);
        createUser.mockResolvedValue({ test: 'Succeeded' });
        normalizePicture.mockResolvedValue("Normalized");
        saveImageAndReturnUrl("URL");

        const result = await signup({ name: 'name', email: 'test@example.com', password: 'password', image: 'Image' });

        expect(result.user).toEqual({ test: 'Succeeded' });
        expect(result.token).toBeDefined();
    });

    it('should invalid message for existing user', async () => {
        findUserByEmail.mockResolvedValue({});
        findUserByName.mockResolvedValue(null);
        createUser.mockResolvedValue({ test: 'Succeeded' });
        normalizePicture.mockResolvedValue("Normalized");
        saveImageAndReturnUrl("URL");

        await expect(signup({ name: 'name', email: 'test@example.com', password: 'password', image: 'Image' }
        )).rejects.toThrow("User already exists with this email.");
    });

    it('should invalid message for too-short name or password, or invalid email', async () => {
        findUserByEmail.mockResolvedValue(null);
        findUserByName.mockResolvedValue(null);
        createUser.mockResolvedValue({ test: 'Succeeded' });
        normalizePicture.mockResolvedValue("Normalized");
        saveImageAndReturnUrl("URL");

        //This error message can be variable, so just check that it throws and doesn't proceed.
        await expect(signup({ name: 'na', email: 'test@example.com', password: 'password', image: 'Image' }
        )).rejects.toThrow();

        expect(findUserByName).not.toHaveBeenCalled();

        await expect(signup({ name: 'nane', email: 'testexample.com', password: 'password', image: 'Image' }
        )).rejects.toThrow();

        expect(findUserByName).not.toHaveBeenCalled();

        await expect(signup({ name: 'name', email: 'test@example.com', password: 'pa', image: 'Image' }
        )).rejects.toThrow();

        expect(findUserByName).not.toHaveBeenCalled();
    });
});