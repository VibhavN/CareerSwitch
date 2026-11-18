
import { supabase } from '../../lib/supabase'
import { handleSupabaseResponse } from '../../lib/handleSupabaseResponse'

import type {
  Application,
  ApplicationInput,
  ApplicationUpdate,
} from '../../types/application'

// READ: Fetch all applications belonging to the signed-in user.
// RLS enforces ownership in the database.
export function getApplications(): Promise<Application[]> {
  return handleSupabaseResponse<Application[]>(
    supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false }),
  )
}

// CREATE: Insert a new application.
export async function createApplication(
  input: ApplicationInput,
): Promise<Application> {
  const { data: authData, error: authError } =
    await supabase.auth.getUser()

  if (authError) throw authError

  if (!authData.user) {
    throw new Error('You must be signed in to create an application.')
  }

  return handleSupabaseResponse<Application>(
    supabase
      .from('applications')
      .insert({
        ...input,
        user_id: authData.user.id,
      })
      .select('*')
      .single(),
  )
}

// UPDATE: Modify an existing application.
export function updateApplication(
  id: string,
  updates: ApplicationUpdate,
): Promise<Application> {
  return handleSupabaseResponse<Application>(
    supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single(),
  )
}

// DELETE: Remove an application.
export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)

  if (error) throw error
}
