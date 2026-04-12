import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import {
  getConversation,
  getConversations,
  sendMessage,
} from "../../lib/api/features/messages";
import { createReservation } from "../../lib/api/features/reservations";
import "./MessagesPage.css";

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

function commitIfActive(isActive, action) {
  if (isActive()) {
    action();
  }
}

function getReservationStatusText(reservation, participantName) {
  if (!reservation) {
    return "No active reservation";
  }

  if (reservation.status !== "active") {
    return `Reservation ${reservation.status}`;
  }

  const nameLabel = participantName ? ` for ${participantName}` : "";
  const untilLabel = formatDate(reservation.endsAt);
  return `Reserved${nameLabel}${untilLabel ? ` until ${untilLabel}` : ""}`;
}

function MessagesHeader({ title, subtitle, action }) {
  return (
    <div className="messages-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function MessagesAlerts({ pageError, notice }) {
  return (
    <>
      {pageError ? <p className="messages-note" data-tone="error">{pageError}</p> : null}
      {notice.text ? (
        <p
          className="messages-note"
          data-tone={notice.type === "error" ? "error" : "success"}
        >
          {notice.text}
        </p>
      ) : null}
    </>
  );
}

function InboxView({ conversations, currentUserId }) {
  if (conversations === undefined) {
    return <p>Loading conversations...</p>;
  }

  if (conversations.length === 0) {
    return <p>No conversations yet.</p>;
  }

  return (
    <div className="messages-stack">
      {conversations.map((item) => {
        const counterpart =
          String(item.ownerUserId) === String(currentUserId)
            ? item.participantUser
            : item.ownerUser;

        return (
          <Link
            className="messages-inbox-item"
            key={item.id}
            to={`/messages/${encodeURIComponent(item.id)}`}
          >
            <div>
              <strong>{item.listing?.title || "Listing conversation"}</strong>
              <span>{counterpart?.name ? `With @${counterpart.name}` : "Private conversation"}</span>
            </div>
            <small>{formatDate(item.lastMessageAt || item.updatedAt || item.createdAt) || "Recently"}</small>
          </Link>
        );
      })}
    </div>
  );
}

function ReservationTools({
  isOwner,
  hasActiveReservation,
  durationDays,
  setDurationDays,
  isCreatingReservation,
  onAssignReservation,
}) {
  if (!isOwner) {
    return null;
  }

  return (
    <section className="messages-section">
      <h2>Assign Book</h2>
      <p>Use this conversation to assign the book to this reader for a fixed duration.</p>
      <div className="messages-controls">
        <label htmlFor="durationDays">
          <span>Duration</span>
          <select
            id="durationDays"
            value={durationDays}
            onChange={(event) => setDurationDays(event.target.value)}
            disabled={isCreatingReservation || hasActiveReservation}
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="21">21 days</option>
            <option value="30">30 days</option>
          </select>
        </label>
        <button
          type="button"
          onClick={onAssignReservation}
          disabled={isCreatingReservation || hasActiveReservation}
        >
          {hasActiveReservation
            ? "Already reserved"
            : isCreatingReservation
              ? "Assigning..."
              : "Assign book"}
        </button>
      </div>
    </section>
  );
}

function ConversationView({
  conversation,
  reservation,
  messages,
  currentUserId,
  newMessageBody,
  setNewMessageBody,
  isSendingMessage,
  onSendMessage,
  durationDays,
  setDurationDays,
  isCreatingReservation,
  onAssignReservation,
}) {
  if (!conversation) {
    return null;
  }

  const listing = conversation.listing ?? null;
  const isOwner =
    Boolean(currentUserId) &&
    String(conversation.ownerUserId) === String(currentUserId);
  const otherUser = isOwner ? conversation.participantUser : conversation.ownerUser;
  const participantName = conversation.participantUser?.name ?? "this reader";
  const hasActiveReservation = reservation?.status === "active";

  return (
    <>
      <MessagesHeader
        title="Conversation"
        subtitle={otherUser?.name ? `Chatting with @${otherUser.name}` : "Private listing conversation"}
        action={
          listing ? (
            <Link className="messages-action" to={`/listView?id=${encodeURIComponent(listing.id)}`}>
              View listing
            </Link>
          ) : null
        }
      />

      <section className="messages-section">
        <div>
          <h2>{listing?.title ?? "Listing"}</h2>
          <p>{listing?.description || "No description provided for this listing."}</p>
        </div>
        <div className="messages-summary">
          <div>
            <span>Format</span>
            <strong>{listing?.format || "Unknown"}</strong>
          </div>
          <div>
            <span>Genre</span>
            <strong>{listing?.genre || "Unknown"}</strong>
          </div>
          <div>
            <span>Reservation</span>
            <strong>{getReservationStatusText(reservation, participantName)}</strong>
          </div>
        </div>
      </section>

      <ReservationTools
        isOwner={isOwner}
        hasActiveReservation={hasActiveReservation}
        durationDays={durationDays}
        setDurationDays={setDurationDays}
        isCreatingReservation={isCreatingReservation}
        onAssignReservation={onAssignReservation}
      />

      <section className="messages-section">
        <h2>Messages</h2>

        {messages.length === 0 ? <p>No messages yet. Start the conversation below.</p> : null}

        {messages.length > 0 ? (
          <div className="messages-stack">
            {messages.map((message) => {
              const isOwnMessage = String(message.senderId) === String(currentUserId);
              return (
                <article
                  data-own={isOwnMessage ? "true" : undefined}
                  key={message.id}
                >
                  <p>{message.body}</p>
                  <small>{formatDate(message.createdAt) || "Just now"}</small>
                </article>
              );
            })}
          </div>
        ) : null}

        <form onSubmit={onSendMessage}>
          <label htmlFor="newMessageBody">
            <span>Send a message</span>
            <textarea
              id="newMessageBody"
              value={newMessageBody}
              onChange={(event) => setNewMessageBody(event.target.value)}
              rows={3}
              placeholder="Ask about pickup, timing, or condition..."
            />
          </label>
          <button type="submit" disabled={isSendingMessage || !newMessageBody.trim()}>
            {isSendingMessage ? "Sending..." : "Send message"}
          </button>
        </form>
      </section>
    </>
  );
}

export default function MessagesPage() {
  const { conversationId = "" } = useParams();
  const { user, isAuthenticated } = useAuth();
  const isInboxView = !conversationId;

  const [thread, setThread] = useState(undefined);
  const [conversations, setConversations] = useState(undefined);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [newMessageBody, setNewMessageBody] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [durationDays, setDurationDays] = useState("14");

  async function loadConversations(isActive = () => true, { showError = true } = {}) {
    try {
      const response = await getConversations();
      commitIfActive(isActive, () => {
        setConversations(Array.isArray(response) ? response : []);
        setPageError("");
      });
    } catch (error) {
      commitIfActive(isActive, () => {
        setConversations([]);
        setPageError(error.message);
        if (showError) {
          setNotice({ type: "error", text: error.message });
        }
      });
    }
  }

  async function loadThread(currentConversationId, isActive = () => true, { showError = true } = {}) {
    try {
      const response = await getConversation(currentConversationId);
      commitIfActive(isActive, () => {
        setThread(response);
        setPageError("");
      });
    } catch (error) {
      commitIfActive(isActive, () => {
        setThread(null);
        setPageError(error.message);
        if (showError) {
          setNotice({ type: "error", text: error.message });
        }
      });
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    let cancelled = false;

    setThread(undefined);
    setConversations(undefined);
    setPageError("");
    setNotice({ type: "", text: "" });

    if (isInboxView) {
      void loadConversations(() => !cancelled);
      return () => {
        cancelled = true;
      };
    }

    void loadThread(conversationId, () => !cancelled);

    const pollId = setInterval(() => {
      void loadThread(conversationId, () => !cancelled, { showError: false });
    }, 1500);

    return () => {
      cancelled = true;
      clearInterval(pollId);
    };
  }, [conversationId, isAuthenticated, isInboxView]);

  async function handleSendMessage(event) {
    event.preventDefault();

    const body = newMessageBody.trim();
    if (!body) {
      return;
    }

    setIsSendingMessage(true);
    setNotice({ type: "", text: "" });

    try {
      await sendMessage(conversationId, { body });
      setNewMessageBody("");
      setNotice({ type: "success", text: "Message sent." });
      await loadThread(conversationId);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setIsSendingMessage(false);
    }
  }

  async function handleAssignReservation() {
    const conversation = thread?.conversation;
    if (!conversation?.listing?.id || !conversation?.participantUser?.id) {
      return;
    }

    setIsCreatingReservation(true);
    setNotice({ type: "", text: "" });

    try {
      await createReservation({
        listingId: conversation.listing.id,
        borrowerUserId: conversation.participantUser.id,
        conversationId: conversation.id,
        durationDays: Number(durationDays),
      });
      setNotice({ type: "success", text: "Reservation created." });
      await loadThread(conversationId);
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setIsCreatingReservation(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="messages-page">
        <div className="messages-shell">
          <section className="messages-panel">
            <h1>Messages</h1>
            <p>Please sign in to view messages.</p>
            <Link className="messages-action" to="/login">
              Sign in
            </Link>
          </section>
        </div>
      </div>
    );
  }

  const conversation = thread?.conversation ?? null;
  const listing = conversation?.listing ?? null;

  return (
    <div className="messages-page">
      <div className="messages-shell">
          {isInboxView ? (
            <>
              <MessagesHeader
                title="Messages"
                subtitle="All of your listing conversations in one place."
              />
              <MessagesAlerts pageError={pageError} notice={notice} />
              <InboxView
                conversations={conversations}
                currentUserId={user?.id ?? ""}
              />
            </>
          ) : (
            <>
              <MessagesAlerts pageError={pageError} notice={notice} />
              {thread === undefined ? (
                <p>Loading conversation...</p>
              ) : (
                <ConversationView
                  conversation={conversation}
                  reservation={thread?.reservation ?? null}
                  messages={thread?.messages ?? []}
                  currentUserId={user?.id ?? ""}
                  newMessageBody={newMessageBody}
                  setNewMessageBody={setNewMessageBody}
                  isSendingMessage={isSendingMessage}
                  onSendMessage={handleSendMessage}
                  durationDays={durationDays}
                  setDurationDays={setDurationDays}
                  isCreatingReservation={isCreatingReservation}
                  onAssignReservation={handleAssignReservation}
                />
              )}
            </>
          )}
      </div>
    </div>
  );
}
