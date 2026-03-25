import AuthenticatedSwitcher from "./AuthenticatedSwitcher";

export default function DisplayChildIfAuthenticated({ children }) {
  return (
    <AuthenticatedSwitcher
      authenticatedComponent={children}
    />
  );
}