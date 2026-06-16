import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '@core/service/auth/auth.service';

@Component({
  selector: 'page-overview',
  imports: [],
  templateUrl: './overview.html',
})
export class PageOverview implements OnInit {
  private authService = inject(AuthService);

  greeting = signal<string>('Hola');
  userName = signal<string>('Cargando...');

  ngOnInit(): void {
    this.calculateGreeting();
    this.fetchUser();
  }

  private calculateGreeting(): void {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting.set('Buenos días');
    } else if (hour >= 12 && hour < 19) {
      this.greeting.set('Buenas tardes');
    } else {
      this.greeting.set('Buenas noches');
    }
  }

  private fetchUser(): void {
    this.authService.loadCurrentUser().subscribe({
      next: (user) => {
        this.userName.set(user.names);
      },
      error: (err) => {
        console.error('Error fetching user info', err);
        this.userName.set('Usuario');
      },
    });
  }
}
