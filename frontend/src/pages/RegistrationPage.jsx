import { useState } from "react";
import { registerUser } from "../lib/api/features/auth";

export default function RegistrationPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegisterSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    //TODO: handle the profile picture in some way

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await registerUser({ name, email, password });
      setSuccessMessage("Registration successful.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1>Registration</h1>
      <form onSubmit={handleRegisterSubmit}>
        <label htmlFor="name">
          Name:
          <input id="name" type="text" name="name" required />
        </label>
        <label htmlFor="email">
          Email:
          <input id="email" type="email" name="email" required />
        </label>
        <label htmlFor="password">
          password:
          <input id="password" type="password" name="password" minLength="6" required />
        </label>
        <label htmlFor="profilePicture">
          Profile Picture:
          <input id="profilePicture" type="file" name="profilePicture" accept="image/*" />
        </label>
        <input type="submit" value={isSubmitting ? "Submitting..." : "Submit"} disabled={isSubmitting} />
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
      {successMessage ? <p>{successMessage}</p> : null}
    </>
  );
}
