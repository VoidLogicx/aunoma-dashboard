import React, { useEffect, useCallback } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/store";
import { getSession, logout } from "../utils/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, setUser, setSession, setLoading, clearAuth } = useAuthStore();

  const SESSION_TIMEOUT = 7200000; // 2 hours

  const handleSessionTimeout = useCallback(() => {
    const lastActivity = localStorage.getItem("aunoma-last-activity");
    if (lastActivity && user) {
      const now = Date.now();
      const timeSinceLastActivity = now - parseInt(lastActivity, 10);
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        logout().then(() => {
          clearAuth();
          navigate("/login", { state: { from: location, sessionExpired: true } });
        });
      }
    }
  }, [user, clearAuth, navigate, location]);

  useEffect(() => {
    const updateLastActivity = () => {
      localStorage.setItem("aunoma-last-activity", Date.now().toString());
    };

    updateLastActivity();

    window.addEventListener("mousemove", updateLastActivity);
    window.addEventListener("keypress", updateLastActivity);
    window.addEventListener("click", updateLastActivity);
    window.addEventListener("scroll", updateLastActivity);

    const timeoutInterval = setInterval(handleSessionTimeout, 60000);

    return () => {
      window.removeEventListener("mousemove", updateLastActivity);
      window.removeEventListener("keypress", updateLastActivity);
      window.removeEventListener("click", updateLastActivity);
      window.removeEventListener("scroll", updateLastActivity);
      clearInterval(timeoutInterval);
    };
  }, [handleSessionTimeout]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        console.log("AuthGuard: Checking auth status");
        const sessionData = await getSession();

        // ✅ FIX: Only accept session if stored manually in localStorage
        const stored = localStorage.getItem("aunoma-session");
        if (!stored) {
          console.log("AuthGuard: No aunoma-session found in localStorage");
          clearAuth();
          return;
        }

        if (sessionData?.session) {
          console.log("AuthGuard: Valid session found", sessionData.session);
          setUser(sessionData.session.user);
          setSession(sessionData.session);
          localStorage.setItem("aunoma-last-activity", Date.now().toString());
        } else {
          console.log("AuthGuard: No valid session returned");
          clearAuth();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setSession, setLoading, clearAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div
          className="w-8 h-8 border-4 border-aunoma-red border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Ładowanie..."
        >
          <span className="sr-only">Ładowanie...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("AuthGuard: No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}