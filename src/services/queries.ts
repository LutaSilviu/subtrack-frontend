import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, subscriptionApi, userApi, plansApi, invoiceApi } from './api';
import type { UserAccount, UserData } from '../App';

// Query Keys
export const queryKeys = {
  currentUser: (userId?: string) => ['currentUser', userId] as const,
  users: (page?: number) => ['users', page] as const,
  plans: ['plans'] as const,
  subscriptions: ['subscriptions'] as const,
  invoice: ['invoice'] as const,
};

// ============= USER HOOKS =============

export function useCurrentUser(userId?: string) {
  return useQuery({
    queryKey: queryKeys.currentUser(userId),
    queryFn: () => authApi.getCurrentUser(userId!),
    enabled: !!userId && !!localStorage.getItem('userId'),
    retry: false,
  });
}


export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<UserAccount> }) =>
      userApi.update(userId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.currentUser(variables.userId), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userApi.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() });
    },
  });
}

// ============= AUTH HOOKS =============

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      authApi.login({ email }),
    onSuccess: (data) => {
  
      if (data.userId) {
        localStorage.setItem('userId', data.userId.toString());
        queryClient.setQueryData(queryKeys.currentUser(data.userId.toString()), data.userId);
      }
    },
  });
}


export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('userId');
      queryClient.clear();
    },
  });
}

// ============= PLANS HOOKS =============

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.plans,
    queryFn: plansApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planData: any) => plansApi.create(planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans });
    },
  });
}

// ============= SUBSCRIPTION HOOKS =============


export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, userData }: { planId: number; userData: UserData }) => {
      console.log('=== useCreateSubscription Hook ===');
      console.log('Plan ID:', planId);
      console.log('User Data:', userData);
      console.log('Phone Number:', userData.phone);
      
      return subscriptionApi.create({ 
        planId, 
        userData,
        phoneNumber: userData.phone 
      });
    },
    onSuccess: (data) => {
      console.log('=== Subscription Mutation Success ===');
      console.log('Response data:', data);
      
      const userId = localStorage.getItem('userId');
      if (userId) {
        queryClient.setQueryData(queryKeys.currentUser(userId), data);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
    },
    onError: (error) => {
      console.error('=== Subscription Mutation Error ===');
      console.error('Error:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      
    },
  });
}

// ============= DATA USAGE HOOK =============

export function useUpdateDataUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, dataUsed }: { userId: string; dataUsed: number }) =>
      userApi.update(userId, { dataUsed } as any),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.currentUser(variables.userId), data);
    },
    // Optimistic update
    onMutate: async ({ userId, dataUsed }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.currentUser(userId) });
      const previousUser = queryClient.getQueryData<UserAccount>(queryKeys.currentUser(userId));
      
      if (previousUser) {
        queryClient.setQueryData<UserAccount>(queryKeys.currentUser(userId), {
          ...previousUser,
          dataUsed,
        });
      }
      
      return { previousUser };
    },
    onError: (err, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.currentUser(variables.userId), context.previousUser);
      }
    },
  });
}

// ============= INVOICE HOOKS =============

export function useInvoice() {
  return useQuery({
    queryKey: queryKeys.invoice,
    queryFn: invoiceApi.getInvoice,
    enabled: !!localStorage.getItem('userId'),
  });
}

export function useBillingHistory() {
  return useQuery({
    queryKey: ['billingHistory'],
    queryFn: invoiceApi.getHistory,
    enabled: !!localStorage.getItem('userId'),
  });
}
