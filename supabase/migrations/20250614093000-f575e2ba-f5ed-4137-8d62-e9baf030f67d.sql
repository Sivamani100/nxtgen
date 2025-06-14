
-- Create a table for college comparisons
CREATE TABLE public.college_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  college_ids BIGINT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own comparisons
ALTER TABLE public.college_comparisons ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own comparisons
CREATE POLICY "Users can view their own comparisons" 
  ON public.college_comparisons 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own comparisons
CREATE POLICY "Users can create their own comparisons" 
  ON public.college_comparisons 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own comparisons
CREATE POLICY "Users can update their own comparisons" 
  ON public.college_comparisons 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own comparisons
CREATE POLICY "Users can delete their own comparisons" 
  ON public.college_comparisons 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add branch prediction functionality to colleges table
ALTER TABLE public.colleges 
ADD COLUMN IF NOT EXISTS branch_cutoff_predictions JSONB DEFAULT '{}'::jsonb;

-- Update existing colleges with some sample branch cutoff data (you can modify this based on actual data)
UPDATE public.colleges 
SET branch_cutoff_predictions = '{
  "Computer Science": {"general": 1000, "obc": 1500, "sc": 3000, "st": 4000},
  "Electronics": {"general": 2000, "obc": 2500, "sc": 4000, "st": 5000},
  "Mechanical": {"general": 3000, "obc": 3500, "sc": 5000, "st": 6000},
  "Civil": {"general": 4000, "obc": 4500, "sc": 6000, "st": 7000}
}'::jsonb
WHERE branch_cutoff_predictions = '{}'::jsonb OR branch_cutoff_predictions IS NULL;
