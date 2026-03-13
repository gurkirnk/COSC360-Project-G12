import {
  getListings,
} from "./browseRepository.js";

export async function retrieveListings() {
  const results = await getListings();

  return {
    results: results,
  };
}
