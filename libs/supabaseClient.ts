import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://hmehwvkxspfmciaxqjlb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZWh3dmt4c3BmbWNpYXhxamxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0NTQ3MTIsImV4cCI6MjAzNTAzMDcxMn0.GoJRM9Oog_9XtKZ7Oqev7siyJn8LEK7DzlCRXlk_7sM"
);
