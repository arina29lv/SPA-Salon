import api from './axios';
import type { User, UserDetail, CreateUser, UpdateUser, PagedResult } from '../types';

export const userApi = {
  getAll: async (page = 1, pageSize = 10): Promise<PagedResult<User>> => {
    const response = await api.get<PagedResult<User>>('/users', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getById: async (id: string): Promise<UserDetail> => {
    const response = await api.get<UserDetail>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUser): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUser): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
