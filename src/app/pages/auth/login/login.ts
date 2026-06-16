import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAtSign, LucideLock } from '@lucide/angular';
import { AuthService } from '@core/service/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-auth-login',
  imports: [CommonModule, ReactiveFormsModule, LucideAtSign, LucideLock],
  templateUrl: './login.html',
})
export class PageAuthLogin {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.authService.login(this.loginForm.getRawValue());

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
          confirmButtonColor: '#3b82f6',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/']); // Redirect to dashboard
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text:
            err.error?.message || 'Credenciales inválidas o cuenta inactiva.',
          confirmButtonColor: '#3b82f6',
        });
      },
    });
  }
}
