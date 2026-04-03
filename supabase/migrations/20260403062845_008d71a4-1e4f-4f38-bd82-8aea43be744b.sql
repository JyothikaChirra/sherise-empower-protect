
-- Scholarship applications
CREATE TABLE public.scholarship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_name TEXT NOT NULL,
  scholarship_type TEXT NOT NULL,
  organization TEXT NOT NULL,
  amount TEXT NOT NULL,
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scholarship_name)
);

ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scholarship applications"
  ON public.scholarship_applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scholarship applications"
  ON public.scholarship_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scholarship applications"
  ON public.scholarship_applications FOR DELETE USING (auth.uid() = user_id);

-- Job applications
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_type TEXT NOT NULL,
  skill_level TEXT NOT NULL,
  salary TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_title, company)
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own job applications"
  ON public.job_applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own job applications"
  ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own job applications"
  ON public.job_applications FOR DELETE USING (auth.uid() = user_id);
