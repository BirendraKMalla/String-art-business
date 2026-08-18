import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../api/api";

/**
 * AdminRoute — renders children only when the current user
 * has role === "admin".
 *
 * - No token  → redirect to /login
 * - Not admin → redirect to /
 * - Loading   → blank (parent keeps its own loading UI)
 */
function AdminRoute({ children }) {
  const { token, user, setUser } = useAuth();

  /*
   * Start in loading state when we have a token — we need to
   * verify the user's role before rendering or redirecting.
   */
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    /*
     * If we already have a user object in context (from the
     * AuthProvider's /me call), decide immediately. Otherwise
     * fetch once.
     */
    const checkAccess = async () => {
      if (!token) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      if (user) {
        setAllowed(user.role === "admin");
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);

        if (data.user) {
          setUser(data.user);
          setAllowed(data.user.role === "admin");
        } else {
          setAllowed(false);
        }
      } catch (error) {
        console.error(error);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [token, user, setUser]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return null;
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
