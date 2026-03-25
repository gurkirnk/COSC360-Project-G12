import { useAuth } from "../../contexts/useAuth";

export default function RoleSwitcher({
  userComponent = <></>,
  adminComponent = <></>,
  guestComponent = <></>,
}) {
  const { isAuthenticated, isAdmin } = useAuth();

  return isAdmin ? adminComponent : (isAuthenticated ? userComponent : guestComponent);
}
