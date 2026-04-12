import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="page-container">
      <h1>Admin Links</h1>
      <Link to="/">Home and Search</Link>
      <br />
      <Link to="/admin/analytics">Analytics</Link>
    </div>
  );
}