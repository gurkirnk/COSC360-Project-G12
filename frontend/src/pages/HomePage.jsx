import { useState } from "react";

export default function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddOne() {
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/counter/increment", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setMessage(
        `Saved +1. Total value: ${data.data.total}. Total events: ${data.data.events}.`
      );
    } catch (error) {
      setMessage(error.message || "Could not connect to backend.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1>Hi!</h1>
      <p>
        The layout component can be used to wrap any page in the app and will
        automatically include the header and footer.
      </p>
      <p>
        Breadcrumbs now follow router paths and update automatically as you
        navigate between pages.
      </p>
      <button type="button" onClick={handleAddOne} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add +1 To Database"}
      </button>
      {message ? <p>{message}</p> : null}
    </>
  );
}
