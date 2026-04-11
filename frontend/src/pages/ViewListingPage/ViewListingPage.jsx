import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { browseListingsById } from "../../lib/api/features/list";
import { createComment, deleteComment, getCommentChainForListing } from "../../lib/api/features/comments";
import { getUserById } from "../../lib/api/features/user";
import CommentThread from "../../components/Comments/CommentThread";
import "./ViewListingPage.css";

function normalizeListing(response) {
  const data = response?.results ?? response?.data ?? response;

  if (data && typeof data === "object" && "results" in data) {
    return data.results;
  }

  return data ?? null;
}

function normalizeComments(response) {
  const data = response?.results ?? response?.data ?? response;

  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}

function normalizeUser(response) {
  const data = response?.results ?? response?.data ?? response;

  if (data && typeof data === "object" && "results" in data) {
    return data.results;
  }

  return data ?? null;
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getListingIdentifier(listing) {
  return listing?.id ?? listing?._id ?? "";
}

function commitIfActive(isActive, action) {
  if (isActive()) {
    action();
  }
}

export default function ViewListingPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("id") || "";

  const [listing, setListing] = useState(undefined);
  const [posterName, setPosterName] = useState("");
  const [comments, setComments] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState("");
  const [replyTargetId, setReplyTargetId] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [newCommentBody, setNewCommentBody] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [pageError, setPageError] = useState("");

  async function loadListing(currentListingId, isActive = () => true) {
    try {
      const response = await browseListingsById(currentListingId);
      const nextListing = normalizeListing(response);

      if (!nextListing) {
        commitIfActive(isActive, () => {
          setListing(null);
          setPosterName("");
          setPageError("Listing not found.");
        });
        return;
      }

      let nextPosterName = "";
      if (nextListing.userId) {
        try {
          const userResponse = await getUserById(nextListing.userId);
          nextPosterName = normalizeUser(userResponse)?.name ?? "";
        } catch {
          nextPosterName = "";
        }
      }

      commitIfActive(isActive, () => {
        setListing(nextListing);
        setPosterName(nextPosterName);
      });
    } catch (error) {
      commitIfActive(isActive, () => {
        setListing(null);
        setPosterName("");
        setPageError(error.message);
      });
    }
  }

  async function loadComments(currentListingId, isActive = () => true, { showError = true } = {}) {
    try {
      const response = await getCommentChainForListing(currentListingId);
      commitIfActive(isActive, () => setComments(normalizeComments(response)));
    } catch (error) {
      commitIfActive(isActive, () => {
        setComments([]);
        if (showError) {
          setNotice({ type: "error", text: error.message });
        }
      });
    }
  }

  useEffect(() => {
    if (!listingId) {
      setPageError("Missing listing id.");
      setListing(null);
      setPosterName("");
      setComments([]);
      return undefined;
    }

    let cancelled = false;

    setListing(undefined);
    setPosterName("");
    setComments(null);
    setPageError("");
    setNotice({ type: "", text: "" });

    void loadListing(listingId, () => !cancelled);
    void loadComments(listingId, () => !cancelled);

    const commentsPollId = setInterval(() => {
      void loadComments(listingId, () => !cancelled, { showError: false });
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(commentsPollId);
    };
  }, [listingId]);

  async function handleCreateComment(event) {
    event.preventDefault();

    const body = newCommentBody.trim();
    if (!body || !listingId) {
      return;
    }

    await submitComment({
      body,
      successMessage: "Comment posted.",
      onSuccess: () => setNewCommentBody(""),
    });
  }

  async function handleReplySubmit(commentId) {
    const body = replyBody.trim();
    if (!body || !listingId) {
      return;
    }

    await submitComment({
      body,
      parentCommentId: commentId,
      successMessage: "Reply posted.",
      onSuccess: () => {
        setReplyBody("");
        setReplyTargetId("");
      },
    });
  }

  async function submitComment({ body, parentCommentId, successMessage, onSuccess }) {
    setIsSubmittingComment(true);
    setNotice({ type: "", text: "" });

    try {
      await createComment({
        body,
        listingId,
        parentCommentId,
      });
      onSuccess();
      setNotice({ type: "success", text: successMessage });
      await loadComments(listingId);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function handleDeleteComment(commentId) {
    setDeletingCommentId(commentId);
    setNotice({ type: "", text: "" });

    try {
      await deleteComment(commentId);
      if (replyTargetId === commentId) {
        setReplyTargetId("");
        setReplyBody("");
      }
      setNotice({ type: "success", text: "Comment deleted." });
      await loadComments(listingId);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setDeletingCommentId("");
    }
  }

  function handleToggleReply(commentId) {
    if (replyTargetId === commentId) {
      setReplyTargetId("");
      setReplyBody("");
      return;
    }

    setReplyTargetId(commentId);
    setReplyBody("");
    setNotice({ type: "", text: "" });
  }

  const isListingLoading = listing === undefined;
  const isCommentsLoading = comments === null;
  const listingIdentifier = getListingIdentifier(listing);
  const canManageListing = Boolean(isAuthenticated && user?.id && listing?.userId && String(listing.userId) === String(user.id));
  const commentList = comments ?? [];

  if (!listingId) {
    return (
      <div className="page">
        <div className="shell">
            <h1 className="title">Listing not found</h1>
            <p className="text-muted">We could not determine which listing to display.</p>
            <Link className="button" to="/browse">
              Back to browse
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="shell">
          <Link className="button back-link" to="/browse">
            Back to browse
          </Link>

          <h1 className="title">{listing?.title ?? (pageError ? "Listing unavailable" : "Loading listing...")}</h1>

          <p className="text-muted">
            {posterName ? `Posted by @${posterName}` : "Posted by an unknown user"}
          </p>

          {listingIdentifier ? <span className="badge">ID {listingIdentifier}</span> : null}

          {pageError ? (
            <section className="card error">
              <h2 className="title">Unable to load listing</h2>
              <p className="text-muted">{pageError}</p>
            </section>
          ) : null}

          {isListingLoading ? <p className="text-muted">Loading listing details...</p> : null}

          {listing ? (
            <>
              <p className="text-muted">
                {listing.description || "No description was provided for this listing."}
              </p>

              <dl className="grid">
                <div className="tile">
                  <dt>Format</dt>
                  <dd>{listing.format || "Unknown"}</dd>
                </div>
                <div className="tile">
                  <dt>Genre</dt>
                  <dd>{listing.genre || "Unknown"}</dd>
                </div>
                <div className="tile">
                  <dt>Created</dt>
                  <dd>{formatDate(listing.createdAt) || "Unknown"}</dd>
                </div>
              </dl>

              {canManageListing ? (
                <div className="row">
                  <Link to={`/listEdit?id=${encodeURIComponent(listingIdentifier)}`} className="button">
                    Edit listing
                  </Link>
                  <Link to={`/listDelete?id=${encodeURIComponent(listingIdentifier)}`} className="button danger">
                    Delete listing
                  </Link>
                </div>
              ) : null}
            </>
          ) : null}

          <div className="section stack">
            <h2 className="title">Comments</h2>

            {notice.text ? (
              <p className={`note${notice.type ? ` ${notice.type}` : ""}`}>{notice.text}</p>
            ) : null}

            {isAuthenticated ? (
              <form className="stack" onSubmit={handleCreateComment}>
                <label>
                  <span>Add a comment</span>
                  <textarea
                    value={newCommentBody}
                    onChange={(event) => setNewCommentBody(event.target.value)}
                    placeholder="Write something thoughtful..."
                    rows={1}
                    required
                  />
                </label>

                <button className="button" type="submit" disabled={isSubmittingComment || !newCommentBody.trim()}>
                  {isSubmittingComment ? "Posting..." : "Post comment"}
                </button>
              </form>
            ) : (
              <div className="row">
                <p className="text-muted">Sign in to comment.</p>
                <Link className="button" to="/login">
                  Sign in
                </Link>
              </div>
            )}

            {isCommentsLoading ? <p className="text-muted">Loading comments...</p> : null}

            {!isCommentsLoading && commentList.length === 0 ? (
              <p className="text-muted">No comments yet.</p>
            ) : null}

            {commentList.length > 0 ? (
              <CommentThread
                comments={commentList}
                currentUserId={user?.id ?? null}
                isAuthenticated={isAuthenticated}
                activeReplyId={replyTargetId}
                replyBody={replyBody}
                onReplyBodyChange={setReplyBody}
                onToggleReply={handleToggleReply}
                onSubmitReply={handleReplySubmit}
                onDeleteComment={handleDeleteComment}
                deletingCommentId={deletingCommentId}
                isSubmittingComment={isSubmittingComment}
              />
            ) : null}
          </div>
      </div>
    </div>
  );
}
