// Common API types

// API Error response
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Success response wrapper
export interface SuccessResponse {
  success: true;
  message?: string;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Sort parameters
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter parameters (generic)
export interface FilterParams {
  [key: string]: unknown;
}

// Query parameters combining pagination, sort, and filters
export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

