export default function RegistrationSwitcher({
  registeredComponent = <></>,
  unregisteredComponent = <></>
}) {
  const isUserLoggedIn = true; //TODO: Implement actual login state check once that is possible
  return isUserLoggedIn ? registeredComponent : unregisteredComponent;
}