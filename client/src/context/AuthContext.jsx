import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);

    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);

    setUser(null);
  };

  /*
   * On mount, if we have a token but no user, fetch the current
   * user from /me so that role / profile info is available
   * across the app.
   */
  useEffect(() => {
    const loadUser = async () => {
      if (!token || user) return;

      try {
        const data = await getCurrentUser(token);

        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
        /*
         * Token may be stale / invalid — clear it so the
         * app falls back to the logged-out state.
         */
        logout();
      }
    };

    loadUser();
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
