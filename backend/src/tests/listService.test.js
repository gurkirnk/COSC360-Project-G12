import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';


import {
    createListing,
    editListing,
    deleteListing,
    findListingById,
    getListings,
    getListingsByUserId,
    getListingsById
} from "../modules/listing/listRepository.js";
import { newListing, modifyListing } from '../modules/listing/listService.js';

vi.mock("../modules/listing/listRepository.js", () => ({
    createListing: vi.fn(),
    editListing: vi.fn(),
    deleteListing: vi.fn(),
    findListingById: vi.fn(),
    getListings: vi.fn(),
    getListingsByUserId: vi.fn(),
    getListingsById: vi.fn()
}));

describe('New listing', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Should return valid for valid input', async () => {
        createListing.mockResolvedValue({Test: "Success"});

        const result = await newListing({title: "title", genre: "genre", format: "Hardcover", description: "", userId: ""});

        expect(result).toEqual({results:{Test:"Success"}});
    });

    it('Should return an error for improper format', async () => {
        createListing.mockResolvedValue({Test: "Success"});

        await expect(newListing({title: "title", genre: "genre", format: "incorrect", description: "", userId: ""})).rejects.toThrow("Illegal Format");
        expect(createListing).not.toHaveBeenCalled();
    });

    it('Should return an error for missing fields', async () => {
        createListing.mockResolvedValue({Test: "Success"});

        await expect(newListing({title: "title", genre: "", format: "Harcover", description: "", userId: ""})).rejects.toThrow("Title, genre, and format are required");
        await expect(newListing({title: "", genre: "f", format: "Harcover", description: "", userId: ""})).rejects.toThrow("Title, genre, and format are required");
        await expect(newListing({title: "title", genre: "f", format: "", description: "", userId: ""})).rejects.toThrow("Title, genre, and format are required");
        expect(createListing).not.toHaveBeenCalled();
    });
});

describe('Modify listing', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Should return valid for valid input', async () => {
        editListing.mockResolvedValue({Test: "Success"});
        findListingById.mockResolvedValue({userId: ""});

        const result = await modifyListing({title: "title", genre: "genre", format: "Hardcover", description: "", userId: ""});

        expect(result).toEqual({results:{Test:"Success"}});
    });

    it('Should return an error for improper format', async () => {
        editListing.mockResolvedValue({Test: "Success"});
        findListingById.mockResolvedValue({userId: ""});

        await expect(modifyListing({title: "title", genre: "genre", format: "incorrect", description: "", userId: ""})).rejects.toThrow("Illegal Format");
        expect(createListing).not.toHaveBeenCalled();
    });

    it('Should return an error for missing fields', async () => {
        editListing.mockResolvedValue({Test: "Success"});
        findListingById.mockResolvedValue({userId: ""});

        await expect(modifyListing({title: "title", genre: "", format: "Harcover", description: "", userId: ""})).rejects.toThrow("Title, genre, and format are required");
        await expect(modifyListing({title: "", genre: "f", format: "Harcover", description: "", userId: ""})).rejects.toThrow("Title, genre, and format are required");
        await expect(modifyListing({title: "title", genre: "f", format: "", description: "", userId: ""})).rejects.toThrow("Title, genre, and format are required");
        expect(editListing).not.toHaveBeenCalled();
    });

    it('Should return an error if listing not found', async () => {
        editListing.mockResolvedValue({Test: "Success"});
        findListingById.mockResolvedValue(null);

        await expect(modifyListing({title: "title", genre: "genre", format: "Harcover", description: "", userId: ""})).rejects.toThrow("Listing not found");
    });

    it('Should return an error listing does not belong to user', async () => {
        editListing.mockResolvedValue({Test: "Success"});
        findListingById.mockResolvedValue({userId: "a"});

        await expect(modifyListing({title: "title", genre: "genre", format: "Harcover", description: "", userId: ""})).rejects.toThrow("Forbidden");
    });
});

