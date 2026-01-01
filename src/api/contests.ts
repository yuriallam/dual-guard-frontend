import { api } from './client';
import { API_ENDPOINTS } from './config';
import type {
  Contest,
  ContestWithRelations,
  CreateContestPayload,
  UpdateContestPayload,
} from '@/types/entities/contest';
import type { ContestParticipation, ContestParticipationWithRelations } from '@/types/entities/contest-participation';
import type { QueryParams, PaginatedResponse } from '@/types/api/common';

// Contests API client
export const contestsApi = {
  // Get all contests (with pagination and filters)
  getAll: async (
    params?: QueryParams,
  ): Promise<PaginatedResponse<Contest | ContestWithRelations>> => {
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
      ? `${API_ENDPOINTS.CONTESTS.BASE}?${queryString}`
      : API_ENDPOINTS.CONTESTS.BASE;

    return api.get<PaginatedResponse<Contest | ContestWithRelations>>(endpoint);
  },

  // Get contest by ID
  getById: async (id: number): Promise<ContestWithRelations> => {
    return api.get<ContestWithRelations>(API_ENDPOINTS.CONTESTS.BY_ID(id));
  },

  // Create contest
  create: async (payload: CreateContestPayload): Promise<Contest> => {
    return api.post<Contest>(API_ENDPOINTS.CONTESTS.BASE, payload);
  },

  // Update contest
  update: async (
    id: number,
    payload: UpdateContestPayload,
  ): Promise<Contest> => {
    return api.patch<Contest>(API_ENDPOINTS.CONTESTS.BY_ID(id), payload);
  },

  // Delete contest
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(API_ENDPOINTS.CONTESTS.BY_ID(id));
  },

  // Join contest
  join: async (id: number): Promise<ContestParticipation> => {
    return api.post<ContestParticipation>(API_ENDPOINTS.CONTESTS.JOIN(id));
  },

  // Leave contest
  leave: async (id: number): Promise<void> => {
    return api.delete<void>(API_ENDPOINTS.CONTESTS.LEAVE(id));
  },

  // Get contest participants
  getParticipants: async (
    id: number,
    params?: QueryParams,
  ): Promise<PaginatedResponse<ContestParticipationWithRelations>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.CONTESTS.PARTICIPANTS(id)}?${queryString}`
      : API_ENDPOINTS.CONTESTS.PARTICIPANTS(id);

    return api.get<PaginatedResponse<ContestParticipationWithRelations>>(
      endpoint,
    );
  },

  // Get active and upcoming contests
  getActiveAndUpcoming: async (): Promise<ContestWithRelations[]> => {
    return api.get<ContestWithRelations[]>(API_ENDPOINTS.CONTESTS.ACTIVE_UPCOMING);
  },

  // Get paginated contests
  getPaginated: async (
    params?: QueryParams,
  ): Promise<PaginatedResponse<Contest | ContestWithRelations>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status as string);
    
    // Add any additional filter params
    Object.entries(params || {}).forEach(([key, value]) => {
      if (!['page', 'limit', 'status'].includes(key) && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.CONTESTS.PAGINATED}?${queryString}`
      : API_ENDPOINTS.CONTESTS.PAGINATED;

    return api.get<PaginatedResponse<Contest | ContestWithRelations>>(endpoint);
  },
};

