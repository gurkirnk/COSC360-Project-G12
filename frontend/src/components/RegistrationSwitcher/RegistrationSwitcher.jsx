import { useAuth } from "../../contexts/useAuth";

export default function RegistrationSwitcher({
  registeredComponent = <></>,
  unregisteredComponent = <></>
}) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? registeredComponent : unregisteredComponent;
}
