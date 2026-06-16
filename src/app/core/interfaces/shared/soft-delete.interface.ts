import { AuditableEntity } from './auditable.interface';

export interface SoftDeleteEntity extends AuditableEntity {
  deleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
}
