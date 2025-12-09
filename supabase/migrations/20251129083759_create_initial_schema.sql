/*
  # Initial Schema Setup for SaaS Dashboard

  ## Overview
  Creates the core tables for the SaaS dashboard application including user profiles,
  prompts, and agents with their configurations.

  ## Tables Created

  1. **profiles**
     - Extends auth.users with additional profile information
     - Columns: id (references auth.users), full_name, role, status, created_at, updated_at
     - Role: 'admin' or 'user'
     - Status: 'active' or 'inactive'

  2. **prompts**
     - Stores reusable prompts for agents
     - Columns: id, name, description, prompt_body, user_id, created_at, updated_at
     - Links to user who created it

  3. **agents**
     - Stores agent configurations
     - Columns: id, name, type, prompt_id, llm_model, voice, status, user_id, created_at, updated_at
     - Agent types: widget_text, widget_voice, widget_video, whatsapp_text, whatsapp_voice, inbound, outbound
     - Status: 'draft' or 'published'

  4. **agent_widget_config**
     - Stores widget-specific configuration
     - Columns: agent_id, position, color, shape, trigger_style, title_text, welcome_message
     - One-to-one with agents table

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated users only
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  prompt_body text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prompts"
  ON prompts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts"
  ON prompts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts"
  ON prompts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts"
  ON prompts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  prompt_id uuid REFERENCES prompts(id) ON DELETE SET NULL,
  llm_model text DEFAULT '',
  voice text DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agents"
  ON agents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agents"
  ON agents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents"
  ON agents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own agents"
  ON agents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create agent_widget_config table
CREATE TABLE IF NOT EXISTS agent_widget_config (
  agent_id uuid PRIMARY KEY REFERENCES agents(id) ON DELETE CASCADE,
  position text DEFAULT 'bottom-right',
  color text DEFAULT '#3B82F6',
  shape text DEFAULT 'rounded',
  trigger_style text DEFAULT 'bubble',
  title_text text DEFAULT 'Chat with us',
  welcome_message text DEFAULT 'Hello! How can I help you today?'
);

ALTER TABLE agent_widget_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agent config"
  ON agent_widget_config FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_widget_config.agent_id
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own agent config"
  ON agent_widget_config FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_widget_config.agent_id
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own agent config"
  ON agent_widget_config FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_widget_config.agent_id
      AND agents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_widget_config.agent_id
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own agent config"
  ON agent_widget_config FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_widget_config.agent_id
      AND agents.user_id = auth.uid()
    )
  );