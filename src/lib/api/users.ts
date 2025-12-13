import { api } from './client';
import { API_ENDPOINTS } from './config';
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/entities/user';
import type { QueryParams, PaginatedResponse } from '@/types/api/common';

// Users API client
export const usersApi = {
  // Get all users (with pagination and filters)
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<User>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    
    // Add any additional filter params
    Object.entries(params || {}).forEach(([key, value]) => {
      if (!['page', 'limit', 'offset', 'sortBy', 'sortOrder'].includes(key) && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.USERS.BASE}?${queryString}`
      : API_ENDPOINTS.USERS.BASE;

    return api.get<PaginatedResponse<User>>(endpoint);
  },

  // Get user by ID
  getById: async (id: number): Promise<User> => {
    return api.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    return api.get<User>(API_ENDPOINTS.USERS.PROFILE);
  },

  // Update current user profile
  updateProfile: async (payload: UpdateUserPayload): Promise<User> => {
    return api.patch<User>(API_ENDPOINTS.USERS.UPDATE_PROFILE, payload);
  },

  // Create user (admin only, typically not used in frontend)
  create: async (payload: CreateUserPayload): Promise<User> => {
    return api.post<User>(API_ENDPOINTS.USERS.BASE, payload);
  },
};

