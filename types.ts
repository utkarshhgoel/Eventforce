
export enum UserType {
  ORGANIZER = 'Organizer',
  CANDIDATE = 'Candidate',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum JobStatus {
  OPEN = 'open',
  COMPLETED = 'completed',
}

export interface Profile {
  id: string;
  user_type: UserType;
  full_name: string;
  bio: string;
  location: string;
  experience_years: number;
  profile_pics: string[];
  rating: number;
}

export interface Job {
  id: string;
  organizer_id: string;
  title: string;
  location_text: string;
  lat_long?: { x: number; y: number };
  date: string;
  start_time: string;
  end_time: string;
  dress_code_male: string;
  dress_code_female: string;
  facilities: {
    food: boolean;
    travel: boolean;
    stay: boolean;
  };
  status: JobStatus;
  requirements: JobRequirement[];
}

export interface JobRequirement {
  id: string;
  job_id: string;
  profile_type: string;
  count_needed: number;
  count_filled: number;
  budget_per_person: number;
  description: string;
}

export interface Application {
  id: string;
  job_req_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  job_title?: string; // Virtual for UI
}

export interface Review {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
}
