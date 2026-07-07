import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '@/features/users/api/usersApi'

const USERS_QUERY_KEY = ['users'] as const
const STABLE_EMPTY_USERS: import('@/features/users/interfaces').UserData[] = []

export function useUsers() {
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsers,
    meta: { errorMessage: 'Erro ao carregar usuários.' },
  })

  return { users: users ?? STABLE_EMPTY_USERS, isLoading, refetch }
}
