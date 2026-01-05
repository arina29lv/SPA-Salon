import api from './axios';
import type { Appointment, AppointmentDetail, CreateAppointment, UpdateAppointment, PagedResult } from '../types';

export const appointmentApi = {
  getAll: async (page = 1, pageSize = 10): Promise<PagedResult<Appointment>> => {
    const response = await api.get<PagedResult<Appointment>>('/appointments', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getById: async (id: string): Promise<AppointmentDetail> => {
    const response = await api.get<AppointmentDetail>(`/appointments/${id}`);
    return response.data;
  },

  getMy: async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/appointments/my');
    return response.data;
  },

  create: async (data: CreateAppointment): Promise<Appointment> => {
    const response = await api.post<Appointment>('/appointments', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAppointment): Promise<Appointment> => {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  approve: async (id: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/appointments/${id}/approve`);
    return response.data;
  },

  reject: async (id: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/appointments/${id}/reject`);
    return response.data;
  },
};
