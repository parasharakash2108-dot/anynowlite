/*
  # Fix Security Issues

  ## Overview
  Re-enables Row Level Security on all tables and adds missing database indexes
  for optimal query performance.

  ## Changes Made

  ### 1. Enable RLS on All Tables
  - **profiles**: Re-enable RLS to secure user profile data
  - **prompts**: Re-enable RLS to secure prompt data
  - **agents**: Re-enable RLS to secure agent configurations
  - **agent_widget_config**: Re-enable RLS to secure widget configurations

  ### 2. Add Missing Indexes
  - **agents.prompt_id**: Add index on foreign key column for optimal JOIN performance
    - This index improves queries that join agents with prompts
    - Prevents full table scans when filtering by prompt_id

  ## Security Impact
  - All tables now properly enforce Row Level Security policies
  - Users can only access their own data through existing policies
  - Unauthenticated access is blocked
  - Query performance improved with proper indexing

  ## Important Notes
  This migration restores production-grade security that was disabled in demo mode.
  All existing RLS policies remain in place and are now enforced.
*/

-- Re-enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_widget_config ENABLE ROW LEVEL SECURITY;

-- Add missing index on foreign key for optimal query performance
CREATE INDEX IF NOT EXISTS idx_agents_prompt_id ON agents(prompt_id);