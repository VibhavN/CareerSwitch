
import { z } from 'zod'

export const applicationSchema = z.object({
  company_name: z.string().trim().min(1, 'Company name is required'),

  job_title: z.string().trim().min(1, 'Job title is required'),

  source: z.enum([
    'linkedin',
    'naukri',
    'indeed',
    'wellfound',
    'company_website',
    'referral',
    'recruiter',
    'other',
  ]),

  status: z.enum([
    'saved',
    'applied',
    'screening',
    'interview',
    'offer',
    'rejected',
    'withdrawn',
    'archived',
  ]),

  job_url: z.union([
    z.literal(''),
    z.string().url('Enter a valid URL'),
  ]).optional(),

  location: z.string().optional(),

employment_type: z.union([
  z.literal(''),
  z.enum([
    'full_time',
    'part_time',
    'contract',
    'internship',
    'freelance',
  ]),
]).optional(),

  salary_min: z.number().nonnegative().nullable().optional(),
  salary_max: z.number().nonnegative().nullable().optional(),

  salary_currency: z.string().default('INR'),

  applied_at: z.string().optional(),
  next_follow_up_at: z.string().optional(),
}).refine(
  (data) =>
    data.salary_min == null ||
    data.salary_max == null ||
    data.salary_max >= data.salary_min,
  {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['salary_max'],
  },
)

export type ApplicationFormInput = z.input<
  typeof applicationSchema
>

export type ApplicationFormValues = z.output<
  typeof applicationSchema
>