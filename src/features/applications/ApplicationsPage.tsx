
import { useState } from 'react'
import { Plus, Briefcase, X, Pencil, Trash2 } from 'lucide-react'

import ApplicationForm from './components/ApplicationForm'
import {
  useApplications,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
} from './applicationHooks'

import type {
  Application,
  ApplicationInput,
} from '../../types/application'

export default function ApplicationsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null)

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useApplications()

  const createMutation = useCreateApplication()
  const updateMutation = useUpdateApplication()
  const deleteMutation = useDeleteApplication()

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending

  function openCreateForm() {
    setEditingApplication(null)
    setShowForm(true)
  }

  function openEditForm(application: Application) {
    setEditingApplication(application)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingApplication(null)
  }

  async function handleSubmit(values: ApplicationInput) {
    try {
      if (editingApplication) {
        await updateMutation.mutateAsync({
          id: editingApplication.id,
          updates: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }

      closeForm()
    } catch (error) {
      console.error('Failed to save application:', error)
    }
  }

  async function handleDelete(application: Application) {
    const confirmed = window.confirm(
      `Delete the application for ${application.company_name}? This cannot be undone.`,
    )

    if (!confirmed) return

    try {
      await deleteMutation.mutateAsync(application.id)
    } catch (error) {
      console.error('Failed to delete application:', error)
    }
  }

  const mutationError =
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep track of your job applications in one place.
          </p>
        </div>

        <button
          onClick={showForm ? closeForm : openCreateForm}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Close' : 'Add application'}
        </button>
      </div>

      {showForm && (
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            {editingApplication
              ? 'Edit application'
              : 'New application'}
          </h2>

          <ApplicationForm
            key={editingApplication?.id ?? 'new-application'}
            initialValues={
              editingApplication
                ? {
                    company_name: editingApplication.company_name,
                    job_title: editingApplication.job_title,
                    source: editingApplication.source,
                    status: editingApplication.status,
                    job_url: editingApplication.job_url ?? '',
                    location: editingApplication.location ?? '',
                    employment_type:
                      editingApplication.employment_type ?? '',
                    salary_min: editingApplication.salary_min,
                    salary_max: editingApplication.salary_max,
                    salary_currency:
                      editingApplication.salary_currency ?? 'INR',
                    applied_at:
                      editingApplication.applied_at ?? '',
                    next_follow_up_at:
                      editingApplication.next_follow_up_at ?? '',
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </section>
      )}

      {mutationError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {mutationError.message}
        </p>
      )}

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            All applications ({applications.length})
          </h2>
        </div>

        {isLoading ? (
          <p className="p-6 text-sm text-gray-500">
            Loading applications...
          </p>
        ) : isError ? (
          <p className="p-6 text-sm text-red-600">
            {error.message}
          </p>
        ) : applications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Briefcase
              className="mx-auto mb-3 text-gray-400"
              size={32}
            />
            <h3 className="font-medium text-gray-900">
              No applications yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first job application to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {application.job_title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {application.company_name}
                    {application.location
                      ? ` · ${application.location}`
                      : ''}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium capitalize text-indigo-700">
                      {application.status.replace('_', ' ')}
                    </span>
                    <p className="mt-1 text-xs text-gray-500">
                      {application.source.replace('_', ' ')}
                    </p>
                  </div>

                  <button
                    onClick={() => openEditForm(application)}
                    title="Edit application"
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => handleDelete(application)}
                    disabled={deleteMutation.isPending}
                    title="Delete application"
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
