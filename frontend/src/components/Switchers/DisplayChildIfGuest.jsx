import RoleSwitcher from "./RoleSwitcher";

export default function DisplayChildIfGuest({ children }) {
  return (
    <RoleSwitcher
      guestComponent={children}
    />
  );
}