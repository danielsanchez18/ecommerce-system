export interface PermissionRequest {
  code: string;
  description?: string;
}

export interface PermissionResponse {
  id: string;
  code: string;
  description?: string;
}
