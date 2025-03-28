import { getSupabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";

export const PREDEFINED_CREDENTIALS = {
  email: "admin@aunoma.ai",
  password: "admin123"
};

// 🔐 LOGIN
export async function login(email: string, password: string) {
  if (email !== PREDEFINED_CREDENTIALS.email || password !== PREDEFINED_CREDENTIALS.password) {
    return { error: new Error("Nieprawidłowe dane logowania"), user: null, session: null };
  }

  try {
    const mockUser = {
      id: "1",
      email: PREDEFINED_CREDENTIALS.email,
      user_metadata: {
        full_name: "Administrator",
        role: "admin"
      },
      app_metadata: {},
      created_at: new Date().toISOString(),
    } as User;

    const mockSession = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: mockUser
    } as Session;

    // ✅ Save session in expected format
    localStorage.setItem("aunoma-session", JSON.stringify(mockSession));

    console.log("✅ Login successful (mock)", { mockUser, mockSession });
    return { error: null, user: mockUser, session: mockSession };
  } catch (error) {
    console.error("❌ Login error:", error);
    return { error: new Error("Błąd podczas logowania"), user: null, session: null };
  }
}

// 🚪 LOGOUT
export async function logout() {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();

    // ✅ Clear local storage session
    localStorage.removeItem("aunoma-session");
    localStorage.removeItem("aunoma-last-activity");
    return { error };
  } catch (error) {
    console.error("❌ Logout error:", error);
    return { error: new Error("Błąd podczas wylogowywania") };
  }
}

// 📦 GET SESSION
export async function getSession(): Promise<{ session: Session | null }> {
  try {
    const storedSession = localStorage.getItem("aunoma-session");
    if (storedSession) {
      const session = JSON.parse(storedSession);
      console.log("🧠 Session loaded from localStorage:", session);
      return { session };
    }

    // Optional fallback to Supabase (not recommended for mock login only)
    const supabase = await getSupabase();
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      localStorage.setItem("aunoma-session", JSON.stringify(data.session));
      console.log("🧠 Session loaded from Supabase:", data.session);
      return { session: data.session };
    }

    return { session: null };
  } catch (error) {
    console.error("❌ getSession error:", error);
    return { session: null };
  }
}

// 👤 GET USER
export async function getUser(): Promise<{ user: User | null }> {
  try {
    const sessionString = localStorage.getItem("aunoma-session");
    if (sessionString) {
      const session = JSON.parse(sessionString);
      return { user: session.user };
    }

    const supabase = await getSupabase();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      return { user: data.user };
    }

    return { user: null };
  } catch (error) {
    console.error("❌ getUser error:", error);
    return { user: null };
  }
}