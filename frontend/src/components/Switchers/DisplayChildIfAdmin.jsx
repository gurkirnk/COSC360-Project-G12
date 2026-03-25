import {RoleSwitcher} from "./RoleSwitcher";

export default function DisplayChildIfAdmin({ children }) {
  return (
    <RoleSwitcher
      adminComponent={children}
    />
  );
}