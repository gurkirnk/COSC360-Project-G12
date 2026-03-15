import {
  getListings,
} from "./browseRepository.js";

export async function retrieveListings({search, genre}) {
  const results = await getListings({search, genre});

  return {
    results: results,
  };
}
