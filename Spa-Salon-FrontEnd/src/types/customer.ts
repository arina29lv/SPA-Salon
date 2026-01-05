import type { AppointmentStatus } from './common';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hasUserAccount: boolean;
}

export interface CustomerAppointment {
  id: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  totalPrice: number;
  services: AppointmentServiceSummary[];
}

export interface AppointmentServiceSummary {
  serviceName: string;
  employeeName: string;
  price: number;
}

export interface CustomerDetail extends Customer {
  dateOfBirth?: string;
  userId?: string;
  appointments: CustomerAppointment[];
}

export interface CreateCustomer {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface UpdateCustomer {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}
