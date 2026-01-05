import api from './axios';
import type { Employee, EmployeeDetail, CreateEmployee, UpdateEmployee, PagedResult } from '../types';

export const employeeApi = {
  getAll: async (page = 1, pageSize = 10): Promise<PagedResult<Employee>> => {
    const response = await api.get<PagedResult<Employee>>('/employees', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getAllList: async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/employees/list');
    return response.data;
  },

  getById: async (id: string): Promise<EmployeeDetail> => {
    const response = await api.get<EmployeeDetail>(`/employees/${id}`);
    return response.data;
  },

  getMe: async (): Promise<Employee> => {
    const response = await api.get<Employee>('/employees/me');
    return response.data;
  },

  create: async (data: CreateEmployee): Promise<Employee> => {
    const response = await api.post<Employee>('/employees', data);
    return response.data;
  },

  update: async (id: string, data: UpdateEmployee): Promise<Employee> => {
    const response = await api.put<Employee>(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
