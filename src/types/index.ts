export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  cv_link?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  location?: string;
  education?: string;
  experience_years?: string;
  projects_count?: string;
  clients_count?: string;
  github?: string;
  linkedin?: string;
  social_links?: {
    github?: string;
    linkedin?: string;
    facebook?: string;
    email?: string;
  };
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  content?: string;
  image: string;
  tags: string[];
  demo_link?: string;
  github_link?: string;
  live_link?: string;
  source_code_zip?: string;
  folder_structure?: any[];
  is_featured: boolean;
  sort_order: number;
  custom_fields_count?: number;
  custom_fields?: any[];
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  type: 'work' | 'education';
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
