import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  applicationSchema,
  type ApplicationFormValues,
  type ApplicationFormInput,
} from "../applicationSchema";

import type { ApplicationInput } from "../../../types/application";

interface ApplicationFormProps {
  onSubmit: (values: ApplicationInput) => void;
  isSubmitting: boolean;
  initialValues?: Partial<ApplicationFormInput>;
}

const fieldClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export default function ApplicationForm({
  onSubmit,
  isSubmitting,
  initialValues,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormInput, unknown, ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company_name: "",
      job_title: "",
      source: "linkedin",
      status: "saved",
      job_url: "",
      location: "",
      employment_type: "",
      salary_currency: "INR",
      ...initialValues
    },
  });

  function submitForm(values: ApplicationFormValues) {
    onSubmit({
      ...values,
      job_url: values.job_url || null,
      location: values.location || null,
      salary_min: values.salary_min ?? null,
      salary_max: values.salary_max ?? null,
      employment_type: values.employment_type || null,
      applied_at: values.applied_at || null,
      next_follow_up_at: values.next_follow_up_at || null,
    });
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Company name *
          </label>
          <input
            {...register("company_name")}
            placeholder="e.g. Wipro"
            className={fieldClass}
          />
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.company_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Job title *
          </label>
          <input
            {...register("job_title")}
            placeholder="e.g. Software Developer"
            className={fieldClass}
          />
          {errors.job_title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.job_title.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Application source *
          </label>
          <select {...register("source")} className={fieldClass}>
            <option value="linkedin">LinkedIn</option>
            <option value="naukri">Naukri</option>
            <option value="indeed">Indeed</option>
            <option value="wellfound">Wellfound</option>
            <option value="company_website">Company website</option>
            <option value="referral">Referral</option>
            <option value="recruiter">Recruiter</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Status *</label>
          <select {...register("status")} className={fieldClass}>
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Job URL</label>
          <input
            {...register("job_url")}
            placeholder="https://..."
            className={fieldClass}
          />
          {errors.job_url && (
            <p className="mt-1 text-sm text-red-600">
              {errors.job_url.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Location</label>
          <input
            {...register("location")}
            placeholder="e.g. Bengaluru"
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Employment type
          </label>
          <select {...register("employment_type")} className={fieldClass}>
            <option value="">Not specified</option>
            <option value="full_time">Full time</option>
            <option value="part_time">Part time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Applied date
          </label>
          <input
            type="date"
            {...register("applied_at")}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Minimum salary
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            {...register("salary_min", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Maximum salary
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            {...register("salary_max", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
            className={fieldClass}
          />
          {errors.salary_max && (
            <p className="mt-1 text-sm text-red-600">
              {errors.salary_max.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Follow-up date
          </label>
          <input
            type="date"
            {...register("next_follow_up_at")}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-100 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initialValues ? "Update application" : "Save application"}
        </button>
      </div>
    </form>
  );
}
