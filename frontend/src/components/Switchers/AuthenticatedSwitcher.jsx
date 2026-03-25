import { useAuth } from "../../contexts/useAuth";

export default function RoleSwitcher({
  authenticatedComponent = <></>,
  unauthenticatedComponent = <></>,
}) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? authenticatedComponent : unauthenticatedComponent;
}
