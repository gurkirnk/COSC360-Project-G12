import { useState } from "react";
import AuthPage from "../components/AuthPage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await logout();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPage title="Logout">
      <p className="message">Are you sure you want to log out?</p>

      <div className="auth-form">
        <button className="submit" type="button" onClick={handleLogout} disabled={isSubmitting}>
          {isSubmitting ? "Logging out..." : "Log Out"}
        </button>
      </div>

      <p className="message">You will be redirected to the home page after logging out.</p>
      {errorMessage ? <p className="message message--error">{errorMessage}</p> : null}
    </AuthPage>
  );
}
