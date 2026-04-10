import {
  findCommentChainByListingId,
  insertComment,
} from "./commentRepository.js";

export async function getCommentChainForListing(listingId) {
  return findCommentChainByListingId(listingId);
}

export async function addComment(commentInput) {
  return insertComment(commentInput);
}
