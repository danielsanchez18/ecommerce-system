import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentRolesAddInfo } from '@components/roles/add/info/info';
import { ComponentRolesAddPermissions } from '@components/roles/add/permissions/permissions';
import { RoleService } from '@core/service/roles/role.service';
import { RolePermissionService } from '@core/service/roles/role-permission.service';
import Swal from 'sweetalert2';
import { catchError, concatMap, forkJoin, throwError } from 'rxjs';

@Component({
  selector: 'page-roles-add',
  imports: [
    ComponentRolesAddInfo,
    ComponentRolesAddPermissions,
    ReactiveFormsModule,
  ],
  templateUrl: './add.html',
})
export class PageRolesAdd {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private rolePermissionService = inject(RolePermissionService);
  private router = inject(Router);

  roleForm: FormGroup = this.fb.group({
    info: this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
    }),
    permissions: this.fb.control<string[]>(
      [],
      [Validators.required, Validators.minLength(1)],
    ),
  });

  isSubmitting = false;

  onSubmit() {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      Swal.fire(
        'Atención',
        'Por favor complete todos los campos requeridos y seleccione al menos un permiso.',
        'warning',
      );
      return;
    }

    this.isSubmitting = true;
    const formValue = this.roleForm.value;

    const roleRequest = {
      name: formValue.info.name,
      description: formValue.info.description,
    };

    this.roleService
      .create(roleRequest)
      .pipe(
        concatMap((roleRes) => {
          const roleId = roleRes.data.id;
          const selectedPermissions: string[] = formValue.permissions;

          const permissionRequests = selectedPermissions.map((permissionId) =>
            this.rolePermissionService.assignPermission({
              roleId,
              permissionId,
            }),
          );

          return forkJoin(permissionRequests);
        }),
        catchError((error) => {
          this.isSubmitting = false;
          console.error(error);
          const errorMsg =
            error.error?.message ||
            'Hubo un error al comunicarse con el servidor.';
          Swal.fire('Error', errorMsg, 'error');
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          Swal.fire(
            'Éxito',
            'Rol creado y permisos asignados correctamente',
            'success',
          ).then(() => {
            this.router.navigate(['/dashboard/roles']);
          });
        },
      });
  }
}
