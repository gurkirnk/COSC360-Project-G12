import { useState } from "react";
import { createListing } from "../lib/api/features/list";
import { useAuth } from "../contexts/useAuth";

export default function CreateListingPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {user, isAuthenticated} = useAuth();
  if(!isAuthenticated){
      return <h1>Please Sign in to create listings</h1>
    }

  async function handleRegisterSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.toString().trim() ?? "";
    const genre = formData.get("genre")?.toString().trim() ?? "";
    const format = formData.get("format")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const userId = user._id;

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await createListing({ title, genre, format, description, userId });
      setSuccessMessage("Listing successful.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  //TODO: Change input types
  return (
    <>
      <h1>Registration</h1>
      <form onSubmit={handleRegisterSubmit}>
        <label htmlFor="title">
          Title:
          <input id="title" type="text" name="title" required />
        </label>
        <label htmlFor="genre">
          Genre:
          <input id="genre" type="text" name="genre" required />
        </label>
        <label htmlFor="format">
          Format:
          <input id="format" type="text" name="format" required />
        </label>
        <label htmlFor="description">
          Description:
          <input id="description" type="text" name="description" />
        </label>
        <input type="submit" value={isSubmitting ? "Submitting..." : "Submit"} disabled={isSubmitting} />
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
      {successMessage ? <p>{successMessage}</p> : null}
    </>
  );
}
