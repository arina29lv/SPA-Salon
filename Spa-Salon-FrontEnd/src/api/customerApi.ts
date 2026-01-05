import api from './axios';
import type { Customer, CustomerDetail, CreateCustomer, UpdateCustomer, PagedResult } from '../types';

export const customerApi = {
  getAll: async (page = 1, pageSize = 10): Promise<PagedResult<Customer>> => {
    const response = await api.get<PagedResult<Customer>>('/customers', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getById: async (id: string): Promise<CustomerDetail> => {
    const response = await api.get<CustomerDetail>(`/customers/${id}`);
    return response.data;
  },

  getMe: async (): Promise<Customer> => {
    const response = await api.get<Customer>('/customers/me');
    return response.data;
  },

  create: async (data: CreateCustomer): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCustomer): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};
