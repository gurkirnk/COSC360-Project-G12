import { useContext } from "react";
import { AuthContext } from "./auth-context";

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("authContext is missing");
  }

  return context;
}
