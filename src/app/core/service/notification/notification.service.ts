import { Injectable, inject, effect, NgZone } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationResponse } from '../../models/notification.model';
import { AuthService } from '../auth/auth.service';
import { API_URL } from '@core/utils/api';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private stompClient: Client;

  private notificationsSubject = new BehaviorSubject<NotificationResponse[]>(
    [],
  );
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private apiUrl = `${API_URL}/notifications`;
  private wsUrl = `${API_URL}/ws`;

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket');

      // Suscribirse a la cola privada del usuario
      this.stompClient.subscribe(
        '/user/queue/notifications',
        (message: Message) => {
          const newNotification: NotificationResponse = JSON.parse(
            message.body,
          );
          this.handleNewNotification(newNotification);
        },
      );
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    // Escuchar cambios de sesión para conectar o desconectar
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.connect();
        this.loadInitialData();
      } else {
        this.disconnect();
      }
    });
  }

  private connect() {
    if (!this.stompClient.active) {
      const token = this.authService.getToken();
      if (token) {
        this.stompClient.connectHeaders = {
          Authorization: `Bearer ${token}`,
        };
        this.stompClient.activate();
      }
    }
  }

  private disconnect() {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
  }

  private handleNewNotification(notification: NotificationResponse) {
    this.ngZone.run(() => {
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...current]);
      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
    });
  }

  // Carga inicial (últimas 20 y conteo de no leídas)
  public loadInitialData() {
    this.getNotifications(0, 20).subscribe((res) => {
      if (res.success && res.data) {
        this.ngZone.run(() => {
          this.notificationsSubject.next(res.data.content);
        });
      }
    });

    this.getUnreadCount().subscribe((res) => {
      if (res.success && res.data !== undefined) {
        this.ngZone.run(() => {
          this.unreadCountSubject.next(res.data);
        });
      }
    });
  }

  // --- REST API ---

  public getNotifications(page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(this.apiUrl, { params });
  }

  public getUnreadCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/unread-count`);
  }

  public markAsRead(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/read`, {});
  }

  public markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/read-all`, {});
  }

  // Utilidad para actualizar UI localmente tras leer
  public localMarkAsRead(id: string) {
    this.ngZone.run(() => {
      const current = this.notificationsSubject.value;
      const updated = current.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      );
      this.notificationsSubject.next(updated);

      if (this.unreadCountSubject.value > 0) {
        this.unreadCountSubject.next(this.unreadCountSubject.value - 1);
      }
    });
  }

  public localMarkAllAsRead() {
    this.ngZone.run(() => {
      const current = this.notificationsSubject.value;
      const updated = current.map((n) => ({ ...n, isRead: true }));
      this.notificationsSubject.next(updated);
      this.unreadCountSubject.next(0);
    });
  }
}
