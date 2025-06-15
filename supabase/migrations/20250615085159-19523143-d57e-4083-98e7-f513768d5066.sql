
-- Create a table to store colleges added to a user's selection list
CREATE TABLE public.user_selected_colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  college_id BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- You could add custom user notes/comments in the future
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_college FOREIGN KEY(college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- RLS: Only let the user insert/select/update/delete their own selections
ALTER TABLE public.user_selected_colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Individual users manage their college list"
  ON public.user_selected_colleges
  FOR ALL
  USING (user_id = auth.uid());

