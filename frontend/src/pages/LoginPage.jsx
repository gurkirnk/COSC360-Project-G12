import { useState } from "react";
import { useAuth } from "../contexts/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loginSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const result = await login({ email, password });
      setSuccessMessage(`Welcome back, ${result.user?.name ?? "user"}.`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1>Login Page</h1>
      <form onSubmit={loginSubmit}>
        <label htmlFor="email">
          Email:
          <input id="email" type="email" name="email" required />
        </label>
        <label htmlFor="password">
          Password:
          <input id="password" type="password" name="password" required />
        </label>
        <input type="submit" value={isSubmitting ? "Submitting..." : "Submit"} disabled={isSubmitting} />
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
      {successMessage ? <p>{successMessage}</p> : null}
    </>
  );
}
