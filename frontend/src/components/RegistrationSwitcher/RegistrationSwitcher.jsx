import { getItem } from "../../lib/storage/fancySessionStorage";
import { AUTH_TOKEN } from "../../lib/storage/sessionStorageVariables";
export default function RegistrationSwitcher({
  registeredComponent = <></>,
  unregisteredComponent = <></>
}) {
  const isUserLoggedIn = getItem(AUTH_TOKEN) !== null; 
  return isUserLoggedIn ? registeredComponent : unregisteredComponent;
}