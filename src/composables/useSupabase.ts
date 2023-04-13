import { createClient } from "@supabase/supabase-js";

const useSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default useSupabase;
