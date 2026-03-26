import {
  createListing,
} from "./listRepository.js";

//TODO: Presumably format, genre, will be limited to certain values at some point, checking for that should go here.
export async function newListing({title, genre, format, description, userId}) {
  const results = await createListing({title, genre, format, description, userId});
  
  return {
    results: results,
  };
}
