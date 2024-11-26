import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://cjqudvdhgvyupoehxgfq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcXVkdmRoZ3Z5dXBvZWh4Z2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMTc4MzEsImV4cCI6MjA0NTg5MzgzMX0.oiuHEAMgG4ug_32YaLOSeMuzUQjPGEnmX0ZgXSdKpsM";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
