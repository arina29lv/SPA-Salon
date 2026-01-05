export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  details?: string;
}

export const UserRole = {
  Guest: 0,
  Customer: 1,
  Employee: 2,
  Manager: 3,
  Admin: 4,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const AppointmentStatus = {
  Requested: 0,
  Scheduled: 1,
  InProgress: 2,
  Completed: 3,
  Cancelled: 4,
  NoShow: 5,
} as const;

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.Guest]: 'guest',
  [UserRole.Customer]: 'customer',
  [UserRole.Employee]: 'employee',
  [UserRole.Manager]: 'manager',
  [UserRole.Admin]: 'admin',
};

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.Requested]: 'requested',
  [AppointmentStatus.Scheduled]: 'scheduled',
  [AppointmentStatus.InProgress]: 'inProgress',
  [AppointmentStatus.Completed]: 'completed',
  [AppointmentStatus.Cancelled]: 'cancelled',
  [AppointmentStatus.NoShow]: 'noShow',
};
