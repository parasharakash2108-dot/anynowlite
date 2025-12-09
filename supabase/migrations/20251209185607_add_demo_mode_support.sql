/*
  # Add Demo Mode Support

  ## Overview
  Adds temporary RLS policies to support demo mode with a hardcoded user ID.
  This allows the application to function without real authentication.

  ## Changes Made

  ### Additional Policies for Demo Mode
  - **All tables**: Add policies that allow access when user_id matches the demo UUID
  - These policies work alongside existing authenticated policies
  - Demo UUID: 00000000-0000-0000-0000-000000000000

  ## Security Notes
  - This is a temporary workaround for demo/prototype purposes
  - For production, implement proper Supabase authentication
  - These policies allow anyone to access data associated with the demo user ID
  - Consider removing these policies once real authentication is implemented

  ## Recommendation
  Replace the fake login with real Supabase auth using:
  - supabase.auth.signUp()
  - supabase.auth.signInWithPassword()
  - Replace hardcoded user_id with auth.uid()
*/

-- Demo mode policies for profiles
CREATE POLICY "Demo: Allow all operations on demo profile"
  ON profiles FOR ALL
  TO anon, authenticated
  USING (id = '00000000-0000-0000-0000-000000000000'::uuid)
  WITH CHECK (id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Demo mode policies for prompts
CREATE POLICY "Demo: Allow all operations on demo prompts"
  ON prompts FOR ALL
  TO anon, authenticated
  USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid)
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Demo mode policies for agents
CREATE POLICY "Demo: Allow all operations on demo agents"
  ON agents FOR ALL
  TO anon, authenticated
  USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid)
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Demo mode policies for agent_widget_config
CREATE POLICY "Demo: Allow all operations on demo agent configs"
  ON agent_widget_config FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_widget_config.agent_id
      AND agents.user_id = '00000000-0000-0000-0000-000000000000'::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents
      WHERE agents.id = agent_widget_config.agent_id
      AND agents.user_id = '00000000-0000-0000-0000-000000000000'::uuid
    )
  );