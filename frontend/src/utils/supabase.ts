import { createClient } from "@supabase/supabase-js";
import brain from "brain";

// Supabase configuration
let supabaseUrl = "";
let supabaseAnonKey = "";
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Initialize Supabase client - will be populated after fetching config
export const getSupabase = async () => {
  if (supabaseClient) return supabaseClient;
  
  try {
    // Only fetch config if we haven't already
    if (!supabaseUrl || !supabaseAnonKey) {
      const response = await brain.get_supabase_config();
      const config = await response.json();
      
      supabaseUrl = config.url;
      supabaseAnonKey = config.anon_key;
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    throw error;
  }
};
