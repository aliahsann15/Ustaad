const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

type ApiOptions = {
  method?: string;
  token?: string | null;
  userId?: string | null;
  body?: unknown;
};

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.userId ? { 'x-user-id': options.userId } : {}),
    },
    body: options.body
      ? isFormData
        ? options.body as FormData
        : JSON.stringify(options.body)
      : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const submitServiceRequest = (payload: { rawText: string; userId?: string | null }, auth: { token?: string | null; userId?: string | null }) => {
  return apiRequest('/service-requests', {
    method: 'POST',
    body: payload,
    token: auth.token,
    userId: auth.userId,
  });
};

export const loginMock = (payload: { phoneNumber: string; password?: string }) => {
  return apiRequest('/auth/login-mock', {
    method: 'POST',
    body: payload,
  });
};

export const signupMock = (payload: { fullName: string; phoneNumber: string; password?: string; languagePreference?: string }) => {
  return apiRequest('/auth/signup-mock', {
    method: 'POST',
    body: payload,
  });
};

export const forgotPasswordMock = (payload: { identifier: string }) => {
  return apiRequest('/auth/forgot-password-mock', {
    method: 'POST',
    body: payload,
  });
};

export const updateBookingStatus = (bookingId: string, status: string, auth: { token?: string | null; userId?: string | null }) => {
  return apiRequest(`/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: { status },
    token: auth.token,
    userId: auth.userId,
  });
};

export const getMyBookings = (auth: { token?: string | null; userId?: string | null }) => {
  return apiRequest('/bookings/me', {
    method: 'GET',
    token: auth.token,
    userId: auth.userId,
  });
};

export const getCurrentUser = (auth: { token?: string | null; userId?: string | null }) => {
  return apiRequest('/users/me', {
    method: 'GET',
    token: auth.token,
    userId: auth.userId,
  });
};

export const updateCurrentUser = (
  userId: string,
  payload:
    | {
        name?: string;
        email?: string;
        phoneNumber?: string;
        address?: string;
        profileImage?: string;
      }
    | FormData,
  auth: { token?: string | null; userId?: string | null },
) => {
  return apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: payload,
    token: auth.token,
    userId: auth.userId,
  });
};
