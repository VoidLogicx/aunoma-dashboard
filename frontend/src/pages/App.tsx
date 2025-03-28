import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/store";
import { getSession } from "../utils/auth";

// Redirect component - this replaces the former home page
export default function App() {
  const navigate = useNavigate();
  const { user, setUser, setSession } = useAuthStore();
  
  useEffect(() => {
    const checkAndRedirect = async () => {
      console.log("App: Checking authentication status");
      
      // If user is already in the store, redirect to dashboard
      if (user) {
        console.log("App: User already authenticated, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
        return;
      }
      
      // Try to retrieve session
      try {
        const { session } = await getSession();
        
        if (session) {
          console.log("App: Found valid session, setting user and redirecting to dashboard");
          setUser(session.user);
          setSession(session);
          navigate("/dashboard", { replace: true });
        } else {
          console.log("App: No valid session found, redirecting to login");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("App: Error checking authentication:", error);
        navigate("/login", { replace: true });
      }
    };
    
    checkAndRedirect();
  }, [navigate, user, setUser, setSession]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-aunoma-bg">
      <div className="p-8 text-center">
        <div 
          className="animate-spin h-8 w-8 border-4 border-aunoma-red border-t-transparent rounded-full mx-auto mb-4" 
          aria-hidden="true"
        ></div>
        <p className="text-aunoma-gray-dark" aria-live="polite" role="status">Przekierowywanie...</p>
      </div>
    </div>
  );
}
