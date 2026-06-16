import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/service/users/user.service';
import { RoleService } from '../../../../core/service/roles/role.service';
import { UserRoleService } from '../../../../core/service/roles/user-role.service';
import { RoleResponse } from '../../../../core/interfaces/roles/role.interface';
import { UserRole } from '../../../../core/interfaces/roles/role.interface';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-users-details-security',
  imports: [CommonModule, FormsModule],
  templateUrl: './security.html',
})
export class PageUsersDetailsSecurity implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private userRoleService = inject(UserRoleService);

  userId: string = '';
  roles: RoleResponse[] = [];
  currentUserRoles: UserRole[] = [];
  loading = false;
  selectedRoleId: string = '';

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.userId = params.get('id') || '';
      if (this.userId) {
        this.loadRoles();
      }
    });
  }

  loadRoles() {
    this.loading = true;
    forkJoin({
      allRoles: this.roleService.findAll(),
      userRoles: this.userRoleService.findRolesByUserId(this.userId)
    }).subscribe({
      next: (res) => {
        this.roles = res.allRoles.data || [];
        this.currentUserRoles = res.userRoles.data || [];
        if (this.currentUserRoles.length > 0) {
          this.selectedRoleId = this.currentUserRoles[0].roleId;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onChangeRole() {
    if (!this.selectedRoleId) return;
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se cambiará el rol de este usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar rol',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        // Quitar roles anteriores
        const removeRequests = this.currentUserRoles.map(ur => this.userRoleService.remove(ur.id));
        
        const changeFlow = removeRequests.length > 0 
          ? forkJoin(removeRequests).pipe(
              switchMap(() => this.userRoleService.assignRoleToUser({ userId: this.userId, roleId: this.selectedRoleId }))
            )
          : this.userRoleService.assignRoleToUser({ userId: this.userId, roleId: this.selectedRoleId });

        changeFlow.subscribe({
          next: () => {
            Swal.fire('¡Cambiado!', 'El rol ha sido actualizado.', 'success');
            this.loadRoles(); // recargar
          },
          error: () => {
            Swal.fire('Error', 'Hubo un problema al cambiar el rol.', 'error');
            this.loading = false;
          }
        });
      }
    });
  }

  onSuspendAccount() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cambiar el estado de este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar estado',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.changeStatus(this.userId).subscribe({
          next: () => {
            Swal.fire('¡Cambiado!', 'El estado de la cuenta ha sido actualizado.', 'success');
          },
          error: () => Swal.fire('Error', 'Hubo un problema al cambiar el estado.', 'error')
        });
      }
    });
  }

  onDeleteUser() {
    Swal.fire({
      title: '¿Estás completamente seguro?',
      text: "Esta acción no se puede deshacer y el usuario será eliminado.",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(this.userId).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success').then(() => {
              this.router.navigate(['/dashboard/usuarios']);
            });
          },
          error: () => Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error')
        });
      }
    });
  }
}
