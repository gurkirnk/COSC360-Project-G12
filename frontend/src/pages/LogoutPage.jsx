import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div>
      <h1> Are you sure you want to logout? </h1>
      <button onClick={handleLogout}>Click to Logout</button>
      <p> You will be redirected to the home page after logging out. </p>
    </div>
  );
}
