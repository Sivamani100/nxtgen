
-- 1. Personalized College Recommendation Quiz (store quiz results and preferences)
CREATE TABLE public.college_recommendation_quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  answers JSONB NOT NULL,
  recommended_colleges JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.college_recommendation_quiz ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can manage their own recommendation quizzes"
  ON public.college_recommendation_quiz
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Scholarship Finder (store custom scholarships that admins can add; open to all for reading)
CREATE TABLE public.scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  eligible_courses TEXT[],
  amount INTEGER,
  application_link TEXT,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view scholarships"
  ON public.scholarships
  FOR SELECT
  USING (true);

-- 3. Application Tracker (track user applications to colleges/scholarships)
CREATE TABLE public.application_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('college', 'scholarship')),
  target_id TEXT NOT NULL, -- points to a college id or scholarship id
  status TEXT NOT NULL DEFAULT 'pending', -- e.g. pending, applied, shortlisted, rejected, accepted
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.application_tracker ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can manage their own applications"
  ON public.application_tracker
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Ask an Expert / Q&A Forum (questions & answers)
CREATE TABLE public.forum_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE TABLE public.forum_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.forum_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read forum questions"
  ON public.forum_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can read forum answers"
  ON public.forum_answers FOR SELECT USING (true);
CREATE POLICY "User can post and manage their questions"
  ON public.forum_questions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can post and manage their answers"
  ON public.forum_answers
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. College Reviews and Ratings (reviews for each college by users)
CREATE TABLE public.college_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id BIGINT NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.college_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews"
  ON public.college_reviews FOR SELECT USING (true);
CREATE POLICY "User can manage their own reviews"
  ON public.college_reviews
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
