
export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'archived'

export type ApplicationSource =
  | 'linkedin'
  | 'naukri'
  | 'indeed'
  | 'wellfound'
  | 'company_website'
  | 'referral'
  | 'recruiter'
  | 'other'

export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'freelance'

export interface Application {
  id: string
  user_id: string
  company_name: string
  job_title: string
  source: ApplicationSource
  status: ApplicationStatus
  job_url: string | null
  location: string | null
  employment_type: EmploymentType | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string | null
  applied_at: string | null
  next_follow_up_at: string | null
  created_at: string
  updated_at: string
}

export interface ApplicationInput {
  company_name: string
  job_title: string
  source: ApplicationSource
  status?: ApplicationStatus
  job_url?: string | null
  location?: string | null
  employment_type?: EmploymentType | null
  salary_min?: number | null
  salary_max?: number | null
  salary_currency?: string
  applied_at?: string | null
  next_follow_up_at?: string | null
}

export type ApplicationUpdate = Partial<ApplicationInput>
