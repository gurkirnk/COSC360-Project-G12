import {
  getListings,
  getListingsById,
} from "./browseRepository.js";

export async function retrieveListings({search, genre}) {
  const results = await getListings({search, genre});

  return {
    results: results,
  };
}

export async function retrieveListingsById(id) {
  const results = await getListingsById(id);

  return {
    results: results,
  };
}