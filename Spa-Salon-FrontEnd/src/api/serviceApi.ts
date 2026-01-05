import api from './axios';
import type { Service, ServiceDetail, CreateService, UpdateService, PagedResult } from '../types';

export const serviceApi = {
  getAll: async (page = 1, pageSize = 10): Promise<PagedResult<Service>> => {
    const response = await api.get<PagedResult<Service>>('/services', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getActive: async (): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services/active');
    return response.data;
  },

  getById: async (id: string): Promise<ServiceDetail> => {
    const response = await api.get<ServiceDetail>(`/services/${id}`);
    return response.data;
  },

  create: async (data: CreateService): Promise<Service> => {
    const response = await api.post<Service>('/services', data);
    return response.data;
  },

  update: async (id: string, data: UpdateService): Promise<Service> => {
    const response = await api.put<Service>(`/services/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
