import { BaseEntity } from './base.interface';

export interface AuditableEntity extends BaseEntity {
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}
