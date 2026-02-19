
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type TEXT CHECK (user_type IN ('Organizer', 'Candidate')),
  full_name TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  experience_years INTEGER DEFAULT 0,
  profile_pics TEXT[] DEFAULT '{}',
  rating DECIMAL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Jobs Table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location_text TEXT NOT NULL,
  lat_long POINT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  dress_code_male TEXT,
  dress_code_female TEXT,
  facilities JSONB DEFAULT '{"food": false, "travel": false, "stay": false}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Job Requirements (Sub-profiles)
CREATE TABLE job_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  profile_type TEXT NOT NULL, -- e.g., Shadow, Runner, Hostess
  count_needed INTEGER NOT NULL DEFAULT 1,
  count_filled INTEGER NOT NULL DEFAULT 0,
  budget_per_person DECIMAL NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Applications Table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_req_id UUID REFERENCES job_requirements(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_req_id, candidate_id)
);

-- 5. Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FUNCTION: Update Job Requirement Count and Job Status
CREATE OR REPLACE FUNCTION handle_application_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    UPDATE job_requirements
    SET count_filled = count_filled + 1
    WHERE id = NEW.job_req_id;
    
    -- Optional: Logic to close job if all requirements are met could go here or in app layer
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_application_accepted
AFTER UPDATE ON applications
FOR EACH ROW
WHEN (NEW.status = 'accepted')
EXECUTE FUNCTION handle_application_acceptance();

-- RLS POLICIES (Example)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Organizers can insert jobs" ON jobs FOR INSERT WITH CHECK (true); -- Simplified for demo
