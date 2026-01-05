import type { AppointmentStatus } from './common';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  totalPrice: number;
  serviceCount: number;
}

export interface AppointmentServiceDetail {
  id: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  employeeId: string;
  employeeName: string;
  price: number;
}

export interface AppointmentDetail {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  services: AppointmentServiceDetail[];
}

export interface CreateAppointmentService {
  serviceId: string;
  employeeId: string;
  price?: number;
}

export interface CreateAppointment {
  customerId?: string;
  appointmentDateTime: string;
  notes?: string;
  services: CreateAppointmentService[];
}

export interface UpdateAppointment {
  appointmentDateTime?: string;
  status?: AppointmentStatus;
  notes?: string;
}
