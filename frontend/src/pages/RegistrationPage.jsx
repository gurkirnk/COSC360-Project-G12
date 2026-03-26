import { useState } from "react";
import AuthPage from "../components/AuthPage";
import { useAuth } from "../contexts/useAuth";
import { createImageUploadPayload } from "../lib/images";

export default function RegistrationPage() {
  const { register } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegisterSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const profilePictureFile = formData.get("profilePicture");

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const profilePicture = await createImageUploadPayload(profilePictureFile);

      const result = await register({ name, email, password, profilePicture });
      setSuccessMessage(`Registration successful. Welcome, ${result.user?.name ?? name}.`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPage title="Register">
      <form className="auth-form" onSubmit={handleRegisterSubmit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            className="input"
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="name"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            className="input"
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            className="input"
            id="password"
            type="password"
            name="password"
            minLength="6"
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            className="input input--file"
            id="profilePicture"
            type="file"
            name="profilePicture"
            accept="image/*"
          />
        </div>

        <input
          className="submit"
          type="submit"
          value={isSubmitting ? "Submitting..." : "Create Account"}
          disabled={isSubmitting}
        />
      </form>

      {errorMessage ? <p className="message message--error">{errorMessage}</p> : null}
      {successMessage ? <p className="message message--success">{successMessage}</p> : null}
    </AuthPage>
  );
}
