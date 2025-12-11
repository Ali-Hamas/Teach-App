import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cigpzjzdancgndiysdha.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZ3B6anpkYW5jZ25kaXlzZGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTQ4NzksImV4cCI6MjA4MDkzMDg3OX0.kNBmJw714xsQD8h509DPYLKdnNpQ9lR7J8_KadNLbZI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
