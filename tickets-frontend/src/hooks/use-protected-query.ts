import {
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { UseSuspenseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys'

type ApiResponse<TData> = {
  data: TData | undefined
  error: unknown
  response: Response
}

function useUnauthorizedHandler() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return (result: ApiResponse<unknown>) => {
    if (result.response.status === 401) {
      queryClient.setQueryData(queryKeys.currentUser, null)
      navigate({ to: '/' })
      throw new Error('Unauthorized')
    }

    if (result.error) {
      throw new Error(
        typeof result.error === 'string'
          ? result.error
          : JSON.stringify(result.error)
      )
    }
  }
}

type ProtectedSuspenseQueryOptions<TData> = Omit<
  UseSuspenseQueryOptions<TData, Error>,
  'queryFn'
> & {
  queryFn: () => Promise<ApiResponse<TData>>
}

export function useProtectedSuspenseQuery<TData>({
  queryFn,
  ...options
}: ProtectedSuspenseQueryOptions<TData>) {
  const handleUnauthorized = useUnauthorizedHandler()

  return useSuspenseQuery({
    ...options,
    queryFn: async () => {
      const result = await queryFn()
      handleUnauthorized(result)
      return result.data as TData
    },
  })
}
