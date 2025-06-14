
-- Create the privacy_policies table
CREATE TABLE IF NOT EXISTS public.privacy_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.privacy_policies ENABLE ROW LEVEL SECURITY;

-- Allow SELECT for everyone
CREATE POLICY "Allow read access to privacy_policies"
  ON public.privacy_policies
  FOR SELECT
  USING (true);

-- Allow INSERT for authenticated users
CREATE POLICY "Allow insert access to privacy_policies for authenticated"
  ON public.privacy_policies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow UPDATE for authenticated users
CREATE POLICY "Allow update access to privacy_policies for authenticated"
  ON public.privacy_policies
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow DELETE for authenticated users
CREATE POLICY "Allow delete access to privacy_policies for authenticated"
  ON public.privacy_policies
  FOR DELETE
  TO authenticated
  USING (true);

-- Ensure unique page numbers
CREATE UNIQUE INDEX IF NOT EXISTS idx_privacy_policies_page_number ON public.privacy_policies(page_number);
