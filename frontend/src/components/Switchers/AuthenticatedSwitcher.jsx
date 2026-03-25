import { useAuth } from "../../contexts/useAuth";

export default function AuthenticatedSwitcher({
  authenticatedComponent = <></>,
  unauthenticatedComponent = <></>,
}) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? authenticatedComponent : unauthenticatedComponent;
}
