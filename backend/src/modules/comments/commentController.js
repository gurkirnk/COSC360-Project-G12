import { addComment, deleteComment, getCommentChainForListing } from "./commentService.js";

export async function getCommentChain(req, res) {
  try {
    const { listingId } = req.query;
    const result = await getCommentChainForListing(listingId);

    return res.status(200).json({
      message: "Retrieved comment chain",
      data: result,
    });
  } catch (error) {
    console.error("commentController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export async function createComment(req, res) {
  try {
    const result = await addComment({
      ...req.body,
      authorId: req.user?.sub,
    });

    return res.status(201).json({
      message: "Comment created",
      data: result,
    });
  } catch (error) {
    console.error("commentController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export async function removeComment(req, res) {
  try {
    const { commentId } = req.body;
    const result = await deleteComment(commentId, req.user?.sub);

    return res.status(200).json({
      message: "Comment deleted",
      data: result,
    });
  } catch (error) {
    console.error("commentController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
