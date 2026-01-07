import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getCurrentUser, logout } from '@/api'
import { queryKeys } from '@/lib/query-keys'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: async () => {
      try {
        const response = await getCurrentUser({ throwOnError: true })
        return response.data
      } catch {
        return null
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const logoutMutation = useMutation({
    mutationFn: () => logout({ throwOnError: true }),
    onSuccess: () => {
      queryClient.clear()
      navigate({ to: '/' })
    },
  })


  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  }
}
