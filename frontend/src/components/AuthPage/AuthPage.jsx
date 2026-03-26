import "./AuthPage.css";

export default function AuthPage({ title, children }) {
  return (
    <section className="auth-page">
      <div className="content">
        <h1 className="title">{title}</h1>
        <div className="auth-card">{children}</div>
      </div>
    </section>
  );
}
