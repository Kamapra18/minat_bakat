// supabase/connection.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://huoaiubgdxhgrsflprte.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1b2FpdWJnZHhoZ3JzZmxwcnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMDQxODEsImV4cCI6MjA3Njc4MDE4MX0.Ph1ohi2O0iBEqv4kex1DlpFL2YPvJ8ms7-mRanuMEFg";

if (!supabaseUrl || !supabaseKey) {

    throw new Error("Supabase environment variables are missing");

}

export const supabase = createClient(supabaseUrl, supabaseKey);