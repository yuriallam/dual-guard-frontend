import { api } from './client';
import { API_ENDPOINTS } from './config';
import type {
  Issue,
  IssueWithRelations,
  CreateIssuePayload,
  UpdateIssuePayload,
  UpdateIssueByAuditorPayload,
  IssueComment,
  IssueCommentWithRelations,
  CreateIssueCommentPayload,
  IssueEscalationComment,
  CreateIssueEscalationCommentPayload,
  UpdateIssueEscalationCommentPayload,
} from '@/types/entities/issue';
import type { QueryParams, PaginatedResponse } from '@/types/api/common';

// Issues API client
export const issuesApi = {
  // Get all issues (with pagination and filters)
  getAll: async (
    params?: QueryParams,
  ): Promise<PaginatedResponse<Issue | IssueWithRelations>> => {
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
      ? `${API_ENDPOINTS.ISSUES.BASE}?${queryString}`
      : API_ENDPOINTS.ISSUES.BASE;

    return api.get<PaginatedResponse<Issue | IssueWithRelations>>(endpoint);
  },

  // Get issues by contest ID
  getByContest: async (
    contestId: number,
    params?: QueryParams,
  ): Promise<PaginatedResponse<Issue | IssueWithRelations>> => {
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
      ? `${API_ENDPOINTS.ISSUES.BY_CONTEST(contestId)}?${queryString}`
      : API_ENDPOINTS.ISSUES.BY_CONTEST(contestId);

    return api.get<PaginatedResponse<Issue | IssueWithRelations>>(endpoint);
  },

  // Get issue by ID
  getById: async (id: number): Promise<IssueWithRelations> => {
    return api.get<IssueWithRelations>(API_ENDPOINTS.ISSUES.BY_ID(id));
  },

  // Create issue
  create: async (payload: CreateIssuePayload): Promise<Issue> => {
    return api.post<Issue>(API_ENDPOINTS.ISSUES.BASE, payload);
  },

  // Update issue
  update: async (id: number, payload: UpdateIssuePayload): Promise<Issue> => {
    return api.patch<Issue>(API_ENDPOINTS.ISSUES.BY_ID(id), payload);
  },

  // Delete issue
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(API_ENDPOINTS.ISSUES.BY_ID(id));
  },

  // Get issue comments
  getComments: async (
    id: number,
    params?: QueryParams,
  ): Promise<PaginatedResponse<IssueComment | IssueCommentWithRelations>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.ISSUES.COMMENTS(id)}?${queryString}`
      : API_ENDPOINTS.ISSUES.COMMENTS(id);

    return api.get<PaginatedResponse<IssueComment | IssueCommentWithRelations>>(
      endpoint,
    );
  },

  // Create issue comment
  createComment: async (
    id: number,
    payload: CreateIssueCommentPayload,
  ): Promise<IssueComment> => {
    return api.post<IssueComment>(API_ENDPOINTS.ISSUES.COMMENTS(id), payload);
  },

  // Get issue escalation
  getEscalation: async (id: number): Promise<IssueEscalationComment | null> => {
    try {
      return await api.get<IssueEscalationComment>(
        API_ENDPOINTS.ISSUES.ESCALATION(id),
      );
    } catch (error) {
      // Return null if escalation doesn't exist
      if (error instanceof Error && 'status' in error && (error as { status: number }).status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create issue escalation (auditor)
  createEscalation: async (
    id: number,
    payload: CreateIssueEscalationCommentPayload,
  ): Promise<IssueEscalationComment> => {
    return api.post<IssueEscalationComment>(
      API_ENDPOINTS.ISSUES.ESCALATION(id),
      payload,
    );
  },

  // Update issue escalation (judge response)
  updateEscalation: async (
    id: number,
    payload: UpdateIssueEscalationCommentPayload,
  ): Promise<IssueEscalationComment> => {
    return api.patch<IssueEscalationComment>(
      API_ENDPOINTS.ISSUES.ESCALATION(id),
      payload,
    );
  },

  // Update issue by auditor
  updateByAuditor: async (
    id: number,
    payload: UpdateIssueByAuditorPayload,
  ): Promise<Issue> => {
    return api.patch<Issue>(API_ENDPOINTS.ISSUES.BY_AUDITOR(id), payload);
  },

  // Delete issue by auditor
  deleteByAuditor: async (id: number): Promise<void> => {
    return api.delete<void>(API_ENDPOINTS.ISSUES.BY_AUDITOR(id), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

