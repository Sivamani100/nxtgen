
-- First, drop the foreign key constraints that depend on the tables we want to remove
ALTER TABLE public.admissions DROP CONSTRAINT IF EXISTS admissions_course_id_fkey;
ALTER TABLE public.admissions DROP CONSTRAINT IF EXISTS admissions_college_id_fkey;
ALTER TABLE public.college_course_mapping DROP CONSTRAINT IF EXISTS college_course_mapping_college_id_fkey;
ALTER TABLE public.college_course_mapping DROP CONSTRAINT IF EXISTS college_course_mapping_course_id_fkey;
ALTER TABLE public.college_recruiters DROP CONSTRAINT IF EXISTS college_recruiters_college_id_fkey;

-- Now we can safely drop the tables
DROP TABLE IF EXISTS public.college_recruiters CASCADE;
DROP TABLE IF EXISTS public.college_course_mapping CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;

-- Also drop the admissions table since it was referencing courses
DROP TABLE IF EXISTS public.admissions CASCADE;

-- Add branch-wise rankings to the colleges table
ALTER TABLE public.colleges 
ADD COLUMN IF NOT EXISTS branches_offered jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS branch_wise_rankings jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS top_recruiters jsonb DEFAULT '[]'::jsonb;

-- Update the comments to explain the structure
COMMENT ON COLUMN public.colleges.branches_offered IS 'Array of branch objects with details like {name, seats, fees_per_year}';
COMMENT ON COLUMN public.colleges.branch_wise_rankings IS 'Object with branch names as keys and ranking data as values, including category-wise cutoffs';
COMMENT ON COLUMN public.colleges.top_recruiters IS 'Array of recruiter objects with name, package, roles, logo_url';

-- Update existing colleges with sample branch and recruiter data structure
UPDATE public.colleges 
SET 
  branches_offered = '[
    {"name": "Computer Science Engineering", "seats": 120, "fees_per_year": 150000},
    {"name": "Electronics and Communication", "seats": 60, "fees_per_year": 140000},
    {"name": "Mechanical Engineering", "seats": 80, "fees_per_year": 130000},
    {"name": "Civil Engineering", "seats": 60, "fees_per_year": 120000},
    {"name": "Electrical Engineering", "seats": 40, "fees_per_year": 135000}
  ]'::jsonb,
  branch_wise_rankings = '{
    "Computer Science Engineering": {
      "general": 15000,
      "obc": 18000,
      "sc": 25000,
      "st": 30000,
      "bc_a": 20000,
      "bc_b": 22000,
      "bc_c": 24000,
      "bc_d": 26000,
      "bc_e": 28000
    },
    "Electronics and Communication": {
      "general": 20000,
      "obc": 25000,
      "sc": 35000,
      "st": 40000,
      "bc_a": 28000,
      "bc_b": 30000,
      "bc_c": 32000,
      "bc_d": 34000,
      "bc_e": 36000
    },
    "Mechanical Engineering": {
      "general": 25000,
      "obc": 30000,
      "sc": 40000,
      "st": 45000,
      "bc_a": 33000,
      "bc_b": 35000,
      "bc_c": 37000,
      "bc_d": 39000,
      "bc_e": 41000
    }
  }'::jsonb,
  top_recruiters = '[
    {"name": "TCS", "package": 350000, "roles": ["Software Engineer", "Analyst"], "logo_url": "/tcs-logo.png"},
    {"name": "Infosys", "package": 400000, "roles": ["Systems Engineer", "Developer"], "logo_url": "/infosys-logo.png"},
    {"name": "Wipro", "package": 380000, "roles": ["Project Engineer", "Consultant"], "logo_url": "/wipro-logo.png"},
    {"name": "Accenture", "package": 450000, "roles": ["Associate Software Engineer"], "logo_url": "/accenture-logo.png"}
  ]'::jsonb
WHERE id <= 20;
