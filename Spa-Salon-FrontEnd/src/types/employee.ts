import type { AppointmentStatus } from './common';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  hasUserAccount: boolean;
}

export interface EmployeeAppointmentService {
  id: string;
  serviceName: string;
  customerName: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  price: number;
}

export interface EmployeeDetail extends Employee {
  hireDate: string;
  userId?: string;
  appointmentServices: EmployeeAppointmentService[];
}

export interface CreateEmployee {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  position: string;
  hireDate: string;
}

export interface UpdateEmployee {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
}
