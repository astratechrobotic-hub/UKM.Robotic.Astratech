-- Create jobdesks table if it doesn't exist
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query → Paste → Run

-- Ensure UUID extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function for updated_at (skip if already exists from full schema)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.jobdesks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  priority VARCHAR(20) NOT NULL DEFAULT 'low' CHECK (priority IN ('low', 'high')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobdesks_assigned_to ON public.jobdesks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_jobdesks_status ON public.jobdesks(status);

-- Trigger for updated_at
CREATE TRIGGER update_jobdesks_updated_at
  BEFORE UPDATE ON public.jobdesks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.jobdesks ENABLE ROW LEVEL SECURITY;

-- Policy: assigned user and admins can view
CREATE POLICY "Job desks are viewable by assigned user and admins"
  ON public.jobdesks
  FOR SELECT
  USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
