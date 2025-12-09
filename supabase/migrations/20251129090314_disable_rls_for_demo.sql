/*
  # Disable RLS for Demo Mode

  ## Overview
  Disables Row Level Security on all tables to allow UI-only access without authentication.
  This is intended for demo/prototype purposes only.

  ## Changes
  - Disable RLS on profiles table
  - Disable RLS on prompts table
  - Disable RLS on agents table
  - Disable RLS on agent_widget_config table

  ## Important Notes
  This configuration is for demo purposes only. In a production environment,
  proper authentication and RLS policies should be enabled.
*/

-- Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompts DISABLE ROW LEVEL SECURITY;
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_widget_config DISABLE ROW LEVEL SECURITY;
