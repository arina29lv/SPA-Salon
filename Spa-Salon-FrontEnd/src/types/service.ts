export interface Service {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  employeeId: string;
  employeeName: string;
}

export interface ServiceDetail {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  employeeId: string;
  employeeFirstName: string;
  employeeLastName: string;
  employeePosition: string;
}

export interface CreateService {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive?: boolean;
  employeeId: string;
}

export interface UpdateService {
  name?: string;
  description?: string;
  durationMinutes?: number;
  price?: number;
  isActive?: boolean;
  employeeId?: string;
}
