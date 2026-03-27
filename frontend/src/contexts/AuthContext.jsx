import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { loginUser, logout as logoutRequest, registerUser } from "../lib/api/features/auth";
import fancyLocalStorage, { getItem, removeItem, setItem } from "../lib/storage/fancyLocalStorage";
import { AUTH_TOKEN, AUTH_USER } from "../lib/storage/localStorageVariables";

function getStoredAuthState() {
  return {
    token: getItem(AUTH_TOKEN, null),
    user: getItem(AUTH_USER, null),
  };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getStoredAuthState);

  //keep other open tabs in sync.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== null && event.key !== AUTH_TOKEN && event.key !== AUTH_USER) {
        return;
      }

      setAuthState(getStoredAuthState());
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  function persistAuth(nextAuthState) {
    if (nextAuthState.token) {
      setItem(AUTH_TOKEN, nextAuthState.token);
    } else {
      removeItem(AUTH_TOKEN);
    }

    if (nextAuthState.user) {
      setItem(AUTH_USER, nextAuthState.user);
    } else {
      removeItem(AUTH_USER);
    }

    setAuthState({
      token: nextAuthState.token ?? null,
      user: nextAuthState.user ?? null,
    });
  }

  async function register(credentials) {
    const data = await registerUser(credentials);
    persistAuth(data);
    return data;
  }

  async function login(credentials) {
    const data = await loginUser(credentials);
    persistAuth(data);
    return data;
  }

  async function logout() {
    try {
      return await logoutRequest();
    } catch {
      console.warn("Logout request failed, but clearing local auth state anyway.");
      return null;
    } finally {
      fancyLocalStorage.clear();
      persistAuth({ token: null, user: null });
    }
  }

  const value = {
    ...authState,
    isAuthenticated: Boolean(authState.token),
    isAdmin: Boolean(authState.user?.role === "admin"),
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
