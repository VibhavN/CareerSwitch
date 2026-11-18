
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { useAuth } from '../auth/AuthContext'

import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from './applicationService'

import type {
  ApplicationInput,
  ApplicationUpdate,
} from '../../types/application'

// Centralised query keys
export const applicationKeys = {
  all: ['applications'] as const,
  list: (userId: string) => ['applications', userId] as const,
}

// READ: Fetch applications
export function useApplications() {
  const { user } = useAuth()

  return useQuery({
    queryKey: applicationKeys.list(user?.id ?? ''),
    queryFn: getApplications,
    enabled: !!user,
  })
}

// CREATE: Add an application
export function useCreateApplication() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (input: ApplicationInput) =>
      createApplication(input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: applicationKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: ['dashboard', user?.id],
        }),
      ])
    },
  })
}

// UPDATE: Edit an application
export function useUpdateApplication() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: ApplicationUpdate
    }) => updateApplication(id, updates),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: applicationKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: ['dashboard', user?.id],
        }),
      ])
    },
  })
}

// DELETE: Remove an application
export function useDeleteApplication() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: applicationKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: ['dashboard', user?.id],
        }),
      ])
    },
  })
}
