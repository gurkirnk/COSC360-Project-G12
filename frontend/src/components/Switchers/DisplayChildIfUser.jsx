import {RoleSwitcher} from "./RoleSwitcher";

export default function DisplayChildIfUser({ children }) {
  return (
    <RoleSwitcher
      userComponent={children}
    />
  );
}