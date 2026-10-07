import { apiClient } from './axios';
import type { UserAccount, Subscription, UserData, PlanResponse } from '../App';

// Backend user response from API
export interface BackendUser {
  userId: number;
  name: string;
  email: string;
  dateOfBirth: string;
  address: string;
}

// Backend user subscription response
export interface UserSubscription {
  subscriptionId: number;
  plan: {
    planId: number;
    name: string;
    price: number;
    includedGb: number;
    overagePrice: number;
    createdAt: string;
    active: boolean;
  };
  user: {
    userId: number;
    name: string;
    email: string;
    dateOfBirth: string;
    address: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  createdAt: string;
  phoneNumber: string;
  currentCycleStart: string;
  currentCycleStop: string;
}

// Usage record response
export interface UsageRecord {
  recordId: number;
  subscription: UserSubscription;
  amountGb: number;
  occurredAt: string;
}

// Invoice response
export interface Invoice {
  invoiceId: number;
  subscription: UserSubscription;
  basePrice: number;
  overageCost: number;
  total: number;
  createdAt: string;
  periodStart: string;
  periodStop: string;
  status: 'DRAFTED' | 'PAID' | 'PENDING';
}

interface LoginRequest {
  email: string;
}

// User API
export const userApi = {
  // GET /users - Get users (paged)


  // GET /users/:id - Get user by id
  getById: async (id: string): Promise<UserAccount> => {
    // TODO: Implement database call to fetch user by id
    //const response = await apiClient.get<UserAccount>(`/users/${id}`);
    //return response.data;
    console.log('TODO: Fetch user from database, id:', id);
    throw new Error('User not found');
  },

  // DELETE /users/:id - Delete user
  delete: async (id: string): Promise<void> => {
    // TODO: Implement database call to delete user
    // await apiClient.delete(`/users/${id}`);
    console.log('TODO: Delete user from database, id:', id);
  },

  // PATCH /users/:id - Partial update user
  update: async (id: string, data: Partial<UserAccount>): Promise<UserAccount> => {
    // TODO: Implement database call to update user
    // const response = await apiClient.patch<UserAccount>(`/users/${id}`, data);
    // return response.data;
    console.log('TODO: Update user in database, id:', id, 'data:', data);
    throw new Error('User not found');
  },
};

// Subscription API
export const subscriptionApi = {
  // POST /subscriptions/create - Create a subscription
  create: async (data: { 
    planId: number; 
    userData: UserData;
    phoneNumber: string;
  }): Promise<any> => {
    const requestBody = {
      subscriptionId: 0,
      plan: {
        planId: data.planId,
        name: '',
        price: 0,
        includedGb: 0,
        overagePrice: 0,
        createdAt: new Date().toISOString().split('T')[0],
        active: true
      },
      user: {
        userId: 0,
        name: data.userData.fullName,
        email: data.userData.email,
        dateOfBirth: data.userData.dateOfBirth || new Date().toISOString().split('T')[0],
        address: data.userData.address,
      },
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      phoneNumber: data.phoneNumber,
      currentCycleStart: new Date().toISOString().split('T')[0],
      currentCycleStop: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    };
    
    console.log('=== Subscription API Request ===');
    console.log('Endpoint: POST /subscriptions/create');
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    
    // TODO: Implement database call to create subscription
    const response = await apiClient.post('/subscriptions/create', requestBody);
    console.log('=== Subscription API Response ===');
    console.log('Status:', response.status);
    console.log('Response Data:', response.data);
     return response.data;
    
    // console.log('TODO: Create subscription in database');
    // return {
    //   subscriptionId: 1,
    //   ...requestBody,
    // };
  },

  // GET /user_subscriptions/:id - Get user subscriptions
  getUserSubscriptions: async (userId: number): Promise<UserSubscription[]> => {
    console.log('=== Get User Subscriptions ===');
    console.log('Endpoint: GET /user_subscriptions/' + userId);
    const response = await apiClient.get<UserSubscription[]>(`/subscriptions/user_subscriptions/${userId}`);
    console.log('=== User Subscriptions Response ===');
    console.log('Status:', response.status);
    console.log('Response Data:', response.data);
    return response.data;
  },
};

// Usage API
export const usageApi = {
  // GET /usage/get_usage_for_subscription/:id - Get usage records for a subscription
  getUsageForSubscription: async (subscriptionId: number): Promise<UsageRecord[]> => {
    console.log('=== Get Usage for Subscription ===');
    console.log('Endpoint: GET /usage/get_usage_for_subscription/' + subscriptionId);
    const response = await apiClient.get<UsageRecord[]>(`/usage/get_usage_for_subscription/${subscriptionId}`);
    console.log('=== Usage Response ===');
    console.log('Status:', response.status);
    console.log('Response Data:', response.data);
    return response.data;
  },

  // POST /usage/add - Add usage data for a subscription
  addUsage: async (subscriptionId: number, amountGb: number): Promise<UsageRecord> => {
    console.log('=== Add Usage Data ===');
    console.log('Endpoint: POST /usage/add_usage');
    console.log('Subscription ID:', subscriptionId);
    console.log('Amount (GB):', amountGb);
    
    const response = await apiClient.post<UsageRecord>('/usage/add_usage', {
      id: subscriptionId,
      usageGb: amountGb
    });
    console.log('=== Add Usage Response ===');
    console.log('Status:', response.status);
    console.log('Response Data:', response.data);
    return response.data;
  },
};

// Helper function to convert backend plan to frontend subscription
const mapPlanToSubscription = (plan: PlanResponse): Subscription => ({
  id: plan.planId,
  name: plan.name,
  price: plan.price,
  data: plan.includedGb,
  features: [
    `${plan.includedGb} GB data`,
    `$${plan.overagePrice} per GB overage`,
    plan.active ? 'Active plan' : 'Inactive plan',
  ],
  popular: false, // Can be determined by logic later
});

// Plans API
export const plansApi = {
  // GET /plans - Get all plans
  getAll: async (): Promise<Subscription[]> => {
    console.log('=== Get All Plans ===');
    console.log('Endpoint: GET /plans');
    const response = await apiClient.get<PlanResponse[]>('/plans');
    console.log('=== Plans Response ===');
    console.log('Status:', response.status);
    console.log('Response Data:', response.data);
    return response.data.map(mapPlanToSubscription);
  },

  // GET /plans/view - View plans (Thymeleaf view)
  view: async (): Promise<Subscription[]> => {
    // TODO: Implement database call to fetch plans for view
    // const response = await apiClient.get<PlanResponse[]>('/plans/view');
    // return response.data.map(mapPlanToSubscription);
    console.log('TODO: Fetch plans for view from database');
    return [];
  },

  // GET /plans/create - Create plan form (for form data if needed)
  getCreateForm: async (): Promise<any> => {
    // TODO: Implement database call to fetch plan creation form data
    // const response = await apiClient.get('/plans/create');
    // return response.data;
    console.log('TODO: Fetch plan creation form data from database');
    return {};
  },

  // POST /plans/create - Submit create plan
  create: async (data: Omit<Subscription, 'id'>): Promise<Subscription> => {
    // TODO: Implement database call to create plan
    // const response = await apiClient.post<Subscription>('/plans/create', data);
    // return response.data;
    console.log('TODO: Create plan in database:', data);
    return { id: 1, ...data };
  },
};

// Invoice API
export const invoiceApi = {
  // GET /invoice - Invoice root
  getInvoice: async (): Promise<any> => {
    // TODO: Implement database call to fetch invoice
    // const response = await apiClient.get('/invoice');
    // return response.data;
    console.log('TODO: Fetch invoice from database');
    return {};
  },

  // Get billing history (if there's a specific endpoint)
  getHistory: async (subscriptionId: number): Promise<Invoice[]> => {
    console.log('=== Get Billing History ===');
    console.log('Endpoint: GET /invoice/' + subscriptionId);
    const response = await apiClient.get<Invoice[]>(`/invoice/${subscriptionId}`);
    console.log('=== Billing History Response ===');
    console.log('Status:', response.status);
    console.log('Response Data:', response.data);
    return response.data;
  },

  // POST /invoice - Create invoice for a subscription
  createInvoice: async (subscriptionId: number): Promise<Invoice> => {
    console.log('=== Create Invoice ===');
    console.log('Endpoint: POST /invoice');
    console.log('Subscription ID:', subscriptionId);
    
    const requestBody = {
      subscriptionId: subscriptionId
    };
    
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    
    const response = await apiClient.post<Invoice>('/invoice', requestBody);
    console.log('=== Create Invoice Response ===');
    console.log('Status:', response.status);
    console.log('Response Data:', response.data);
    return response.data;
  },
};

// Auth helpers (if you have auth endpoints, otherwise we'll use user endpoints)
export const authApi = {
  // Assuming login returns token and user
  login: async (data: LoginRequest): Promise<BackendUser> => {
    console.log('=== Login API Request ===');
    console.log('Endpoint: POST /login/' + data.email);
    
    try {
      const response = await apiClient.post<BackendUser>('/auth/' + data.email);
      console.log('=== Auth API Response ===');
      console.log('Status:', response.status);
      console.log('Response Data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('=== Login API Error ===');
      if (error.response?.data?.error) {
        console.error('Error:', error);
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  // Get current user - using user by id
  getCurrentUser: async (userId: string): Promise<UserAccount> => {
    // TODO: Implement database call to fetch current user
    console.log('TODO: Fetch current user from database, userId:', userId);
    return userApi.getById(userId);
  },

  logout: async (): Promise<void> => {
    // TODO: Implement database call for logout (if needed)
    console.log('TODO: Logout user (clear session in database if needed)');
  },
};
