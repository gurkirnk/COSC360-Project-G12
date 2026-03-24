import { useState } from "react";
import { AuthContext } from "./auth-context";
import { loginUser, logout as logoutRequest, registerUser } from "../lib/api/features/auth";
import { getItem, removeItem, setItem } from "../lib/storage/fancySessionStorage";
import { AUTH_TOKEN, AUTH_USER } from "../lib/storage/sessionStorageVariables";

function getInitialAuthState() {
  return {
    token: getItem(AUTH_TOKEN, null),
    user: getItem(AUTH_USER, null),
  };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

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
      return null;
    } finally {
      persistAuth({ token: null, user: null });
    }
  }

  const value = {
    ...authState,
    isAuthenticated: Boolean(authState.token),
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
