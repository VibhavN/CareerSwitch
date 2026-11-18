
export async function handleSupabaseResponse<T>(
  request: PromiseLike<{
    data: T | null
    error: { message: string } | null
  }>,
): Promise<T> {
  const { data, error } = await request

  if (error) {
    throw error
  }

  if (data === null) {
    throw new Error('The server returned no data.')
  }

  return data
}
