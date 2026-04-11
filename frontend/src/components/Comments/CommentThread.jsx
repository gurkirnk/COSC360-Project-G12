import "./CommentThread.css";

function getCommentAuthorUsername(authorId) {
  if (!authorId) {
    return null;
  }

  if (typeof authorId === "object") {
    return authorId.name ?? null;
  }

  return null;
}

function formatCommentDate(value) {
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

function CommentNode({
  comment,
  currentUserId,
  isAuthenticated,
  activeReplyId,
  replyBody,
  onReplyBodyChange,
  onToggleReply,
  onSubmitReply,
  onDeleteComment,
  deletingCommentId,
  isSubmittingComment,
}) {
  const isDeleted = Boolean(comment.deletedAt);
  const authorUsername = getCommentAuthorUsername(comment.authorId);
  const authorId = comment.authorId?.id ?? comment.authorId?._id ?? (typeof comment.authorId === "string" ? comment.authorId : null);
  const canDelete = Boolean(isAuthenticated && currentUserId && authorId && String(currentUserId) === String(authorId));
  const canReply = isAuthenticated && !isDeleted;
  const isReplyOpen = activeReplyId === comment.id;

  return (
    <li className={isDeleted ? "deleted" : undefined}>
      <article className="card">
        <div className="meta">
          <span className="author">
            {isDeleted ? "Deleted comment" : authorUsername ? `${authorUsername}` : "Unknown user"}
          </span>
          <span className="text-muted">{formatCommentDate(comment.createdAt)}</span>
        </div>

        <p className="text-muted">{comment.body}</p>

        {(canReply || canDelete) ? (
          <div className="row">
            {canReply ? (
              <button
                className="button"
                type="button"
                onClick={() => onToggleReply(comment.id)}
                disabled={isSubmittingComment}
              >
                {isReplyOpen ? "Cancel reply" : "Reply"}
              </button>
            ) : null}

            {canDelete ? (
              <button
                className="button danger"
                type="button"
                onClick={() => onDeleteComment(comment.id)}
                disabled={deletingCommentId === comment.id || isSubmittingComment}
              >
                {deletingCommentId === comment.id ? "Deleting..." : "Delete"}
              </button>
            ) : null}
          </div>
        ) : null}

        {isReplyOpen && canReply ? (
          <form
            className="stack"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitReply(comment.id);
            }}
          >
            <label>
              <span>Write a reply</span>
              <textarea
                value={replyBody}
                onChange={(event) => onReplyBodyChange(event.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                required
              />
            </label>

            <div className="row">
              <button
                className="button"
                type="button"
                onClick={() => onToggleReply(comment.id)}
                disabled={isSubmittingComment}
              >
                Cancel
              </button>
              <button
                className="button"
                type="submit"
                disabled={isSubmittingComment || !replyBody.trim()}
              >
                {isSubmittingComment ? "Posting..." : "Post reply"}
              </button>
            </div>
          </form>
        ) : null}
      </article>

      {comment.replies?.length ? (
        <div className="nested">
          <CommentThread
            comments={comment.replies}
            currentUserId={currentUserId}
            isAuthenticated={isAuthenticated}
            activeReplyId={activeReplyId}
            replyBody={replyBody}
            onReplyBodyChange={onReplyBodyChange}
            onToggleReply={onToggleReply}
            onSubmitReply={onSubmitReply}
            onDeleteComment={onDeleteComment}
            deletingCommentId={deletingCommentId}
            isSubmittingComment={isSubmittingComment}
          />
        </div>
      ) : null}
    </li>
  );
}

export default function CommentThread(props) {
  const { comments } = props;

  if (!comments?.length) {
    return null;
  }

  return (
    <ul className="thread">
      {comments.map((comment) => (
        <CommentNode key={comment.id} comment={comment} {...props} />
      ))}
    </ul>
  );
}
