export interface Division {
  id: string;
  name: string;
  icon_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  nim: string;
  division_id: string;
  role: "admin" | "member";
  avatar_url: string | null;
  experience: string | null;
  created_at?: string;
  updated_at?: string;
}

export type JobDeskStatus = "todo" | "doing" | "done";
export type JobDeskPriority = "low" | "high";

export interface JobDesk {
  id: string;
  title: string;
  description: string;
  status: JobDeskStatus;
  priority: JobDeskPriority;
  assigned_to: string;
  created_at?: string;
  updated_at?: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  author_id: string;
  image_url: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  title: string;
  event_date: string;
  location: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export type CompetitionStatus = "ongoing" | "completed";
export type CompetitionResult = "win" | "lose";export interface Competition {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  status: CompetitionStatus;
  result: CompetitionResult | null;
  created_at?: string;
  updated_at?: string;
}
