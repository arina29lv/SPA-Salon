import type { UserRole } from './common';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface CustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface EmployeeInfo {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
}

export interface UserDetail extends User {
  customer?: CustomerInfo;
  employee?: EmployeeInfo;
}

export interface CreateUser {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  position?: string;
  hireDate?: string;
}

export interface UpdateUser {
  email?: string;
  role?: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  firstName?: string;
  lastName?: string;
}
