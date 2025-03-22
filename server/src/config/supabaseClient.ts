import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./constants";
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
