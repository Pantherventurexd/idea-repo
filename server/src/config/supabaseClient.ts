import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ozxwhlvwkqfibqaxcfht.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96eHdobHZ3a3FmaWJxYXhjZmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NTczMjgsImV4cCI6MjA1NzUzMzMyOH0.xhc26awjkhS5zaSzRhA7iXWzLI4FGBi7cCcGseBgjBI";
export const supabase = createClient(supabaseUrl, supabaseKey);
