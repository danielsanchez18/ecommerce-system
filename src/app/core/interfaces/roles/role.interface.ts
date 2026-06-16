import { SoftDeleteEntity } from '@core/interfaces/shared/soft-delete.interface';

export interface RoleRequest {
  name: string;
  description?: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  usersCount?: number;
}

export interface RolePermission extends SoftDeleteEntity {
  roleId: string;
  permissionId: string;
}

export interface UserRole extends SoftDeleteEntity {
  userId: string;
  roleId: string;
}
