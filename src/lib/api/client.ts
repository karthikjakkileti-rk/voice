// =============================================================================
// Edu-Voice-AI — Centralized HTTP API Client
// Strict Contract-Driven REST API v1
// =============================================================================

import { getSupabaseBrowserClient } from '../supabase/client';
import { ApiError } from './errors';
import { SuccessResponse, PaginatedResponse, ErrorResponse } from '@/types/api';

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
const API_BASE_URL = rawBaseUrl.replace(/[\\"'`]/g, '').trim() || 'http://localhost:8000/api/v1';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, skipAuth = false, headers: customHeaders, ...fetchOptions } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
      }
    } catch {
      // Allow caller to handle if token is missing
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
  } catch (networkError: any) {
    throw new ApiError(
      networkError.message || 'Unable to connect to the backend server. Please check your network.',
      'NETWORK_ERROR',
      0
    );
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  let json: any;
  try {
    json = await response.json();
  } catch {
    if (!response.ok) {
      throw ApiError.fromHttp(response.status, response.statusText);
    }
    return null as unknown as T;
  }

  if (!response.ok || json.success === false) {
    const errorEnvelope = json as ErrorResponse;
    const errorDetails = errorEnvelope.error || {
      code: 'API_ERROR',
      message: response.statusText || 'API request failed',
      details: {},
    };

    throw new ApiError(
      errorDetails.message || 'Request failed',
      errorDetails.code || 'API_ERROR',
      response.status,
      errorDetails.details
    );
  }

  // If response matches standard envelope, return data payload
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data as T;
  }

  return json as T;
}

export async function apiPaginatedClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<PaginatedResponse<T>> {
  const { params, skipAuth = false, headers: customHeaders, ...fetchOptions } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
      }
    } catch {
      // Continue
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
  } catch (networkError: any) {
    throw new ApiError(
      networkError.message || 'Network error connecting to backend.',
      'NETWORK_ERROR',
      0
    );
  }

  const json = await response.json();

  if (!response.ok || json.success === false) {
    const errorEnvelope = json as ErrorResponse;
    const errorDetails = errorEnvelope.error || {
      code: 'API_ERROR',
      message: response.statusText || 'Paginated API request failed',
      details: {},
    };

    throw new ApiError(
      errorDetails.message || 'Paginated request failed',
      errorDetails.code || 'API_ERROR',
      response.status,
      errorDetails.details
    );
  }

  return json as PaginatedResponse<T>;
}
