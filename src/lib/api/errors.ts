// =============================================================================
// Edu-Voice-AI — API Error Handling Standard
// =============================================================================

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, any>;
  public readonly isAuthError: boolean;
  public readonly isForbidden: boolean;
  public readonly isNotFound: boolean;

  constructor(message: string, code: string, status: number, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.isAuthError = status === 401 || code === 'AUTHENTICATION_REQUIRED' || code === 'INVALID_TOKEN';
    this.isForbidden = status === 403 || code === 'TENANT_ACCESS_DENIED' || code === 'FORBIDDEN';
    this.isNotFound = status === 404 || code === 'RESOURCE_NOT_FOUND';
  }

  static fromHttp(status: number, message?: string, code?: string, details?: Record<string, any>): ApiError {
    const defaultCode =
      status === 401
        ? 'AUTHENTICATION_REQUIRED'
        : status === 403
        ? 'TENANT_ACCESS_DENIED'
        : status === 404
        ? 'RESOURCE_NOT_FOUND'
        : status === 409
        ? 'CONFLICT'
        : status === 422
        ? 'VALIDATION_ERROR'
        : 'INTERNAL_SERVER_ERROR';

    const defaultMsg =
      status === 401
        ? 'Authentication required. Please sign in.'
        : status === 403
        ? "You don't have permission to perform this action."
        : status === 404
        ? 'The requested resource was not found.'
        : status === 409
        ? 'A conflict occurred with the current state.'
        : status === 422
        ? 'Invalid input parameters. Please check your submission.'
        : 'An unexpected server error occurred.';

    return new ApiError(message || defaultMsg, code || defaultCode, status, details);
  }
}
