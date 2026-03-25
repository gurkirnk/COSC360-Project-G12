import { useState } from "react";
import AuthPage from "../components/AuthPage";
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
    <AuthPage title="Login">
      <form className="auth-form" onSubmit={loginSubmit}>
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
            placeholder="********"
            autoComplete="current-password"
            required
          />
        </div>

        <input
          className="submit"
          type="submit"
          value={isSubmitting ? "Submitting..." : "Login"}
          disabled={isSubmitting}
        />
      </form>

      {errorMessage ? <p className="message message--error">{errorMessage}</p> : null}
      {successMessage ? <p className="message message--success">{successMessage}</p> : null}
    </AuthPage>
  );
}
