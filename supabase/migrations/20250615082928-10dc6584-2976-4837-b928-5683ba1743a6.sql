
-- Enable RLS for college_reviews
ALTER TABLE public.college_reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own reviews
CREATE POLICY "Users can view their own reviews"
  ON public.college_reviews
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to insert their own reviews
CREATE POLICY "Users can add their own review"
  ON public.college_reviews
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own review"
  ON public.college_reviews
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete their own review"
  ON public.college_reviews
  FOR DELETE
  USING (user_id = auth.uid());
