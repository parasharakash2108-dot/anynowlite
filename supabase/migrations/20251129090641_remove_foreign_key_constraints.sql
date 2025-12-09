/*
  # Remove Foreign Key Constraints for Demo Mode

  ## Overview
  Removes foreign key constraints on user_id columns to allow demo data
  without requiring actual auth.users records.

  ## Changes
  1. Drop foreign key constraint on prompts.user_id
  2. Drop foreign key constraint on agents.user_id
  3. Make user_id nullable or use a default value

  ## Important Notes
  This is for demo purposes only. In production, proper foreign key
  relationships should be maintained.
*/

-- Drop foreign key constraint on prompts table
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'prompts_user_id_fkey' 
    AND table_name = 'prompts'
  ) THEN
    ALTER TABLE prompts DROP CONSTRAINT prompts_user_id_fkey;
  END IF;
END $$;

-- Drop foreign key constraint on agents table
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'agents_user_id_fkey' 
    AND table_name = 'agents'
  ) THEN
    ALTER TABLE agents DROP CONSTRAINT agents_user_id_fkey;
  END IF;
END $$;

-- Drop foreign key constraint on profiles table
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
END $$;
