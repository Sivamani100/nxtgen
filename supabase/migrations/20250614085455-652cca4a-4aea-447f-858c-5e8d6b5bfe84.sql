
-- Add exam-specific cutoff ranks to colleges table
ALTER TABLE public.colleges 
ADD COLUMN IF NOT EXISTS exam_cutoffs jsonb DEFAULT '{}'::jsonb;

-- Update the comment to explain the structure
COMMENT ON COLUMN public.colleges.exam_cutoffs IS 'Object with exam names as keys and category-wise cutoff data as values. Structure: {"jee-main": {"general": 15000, "obc": 18000}, "ap-eamcet": {"general": 5000, "bc_a": 6000}}';

-- Add eligible exams array to track which exams are accepted by each college
ALTER TABLE public.colleges 
ADD COLUMN IF NOT EXISTS eligible_exams text[] DEFAULT ARRAY[]::text[];

-- Update existing colleges with sample exam cutoff data
UPDATE public.colleges 
SET 
  exam_cutoffs = '{
    "jee-main": {
      "general": 15000,
      "obc": 18000,
      "sc": 25000,
      "st": 30000
    },
    "ap-eamcet": {
      "general": 5000,
      "obc": 6000,
      "sc": 8000,
      "st": 10000,
      "bc_a": 5500,
      "bc_b": 6500,
      "bc_c": 7000,
      "bc_d": 7500,
      "bc_e": 8500
    }
  }'::jsonb,
  eligible_exams = ARRAY['jee-main', 'ap-eamcet']
WHERE id <= 10;

-- Update some colleges with JEE Advanced eligibility (top tier colleges)
UPDATE public.colleges 
SET 
  exam_cutoffs = jsonb_set(
    exam_cutoffs,
    '{jee-advanced}',
    '{"general": 2000, "obc": 2500, "sc": 4000, "st": 5000}'::jsonb
  ),
  eligible_exams = array_append(eligible_exams, 'jee-advanced')
WHERE id <= 5;

-- Update some colleges with NEET eligibility (medical colleges)
UPDATE public.colleges 
SET 
  exam_cutoffs = jsonb_set(
    exam_cutoffs,
    '{neet}',
    '{"general": 50000, "obc": 65000, "sc": 85000, "st": 95000}'::jsonb
  ),
  eligible_exams = array_append(eligible_exams, 'neet')
WHERE id BETWEEN 6 AND 15 AND type ILIKE '%medical%';

-- Update TS EAMCET for some colleges
UPDATE public.colleges 
SET 
  exam_cutoffs = jsonb_set(
    exam_cutoffs,
    '{ts-eamcet}',
    '{"general": 4500, "obc": 5500, "sc": 7500, "st": 9000, "bc_a": 5000, "bc_b": 6000, "bc_c": 6500, "bc_d": 7000, "bc_e": 8000}'::jsonb
  ),
  eligible_exams = array_append(eligible_exams, 'ts-eamcet')
WHERE id BETWEEN 11 AND 20;
