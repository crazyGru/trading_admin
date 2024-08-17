import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in the header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/token', 
      new URLSearchParams({
        'username': username,
        'password': password
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const signup = async (userData: { username: string; password: string; email: string }) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Signup failed', error);
    throw error;
  }
};

// Update other API calls to use the api instance
export const getUsers = async (page: number, limit: number) => {
  const response = await api.get(`/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserDetails = async (username: string) => {
  const response = await api.get(`/users/${username}`);
  return response.data;
};

export const getUserChargeHistory = async (username: string) => {
  const response = await api.get(`/users/${username}/charge_history`);
  return response.data;
};

export const getUserWithdrawHistory = async (username: string) => {
  const response = await api.get(`/users/${username}/withdraw_history`);
  return response.data;
};

export const getUserBalance = async (username: string) => {
  const response = await api.get(`/users/${username}/balance`);
  return response.data;
};

export const updateUserAutoWithdraw = async (username: string, autoWithdraw: boolean) => {
  const response = await api.patch(`/user/${username}/auto_withdraw`, { auto_withdraw: autoWithdraw });
  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Logout failed', error);
    throw error;
  }
};