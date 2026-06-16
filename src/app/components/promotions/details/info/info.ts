import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
  LucideCalendarClock,
  LucideGift,
  LucidePercent,
  LucideTag,
} from '@lucide/angular';
import { PromotionResponse } from '@core/interfaces/promotions/promotion.interface';
import { ComponentSharedStates } from '@components/shared/states/states';

@Component({
  selector: 'component-promotions-details-info',
  imports: [
    CommonModule,
    LucidePercent,
    LucideGift,
    LucideTag,
    LucideCalendarClock,
    ComponentSharedStates,
  ],
  templateUrl: './info.html',
})
export class ComponentPromotionsDetailsInfo implements OnInit, OnDestroy {
  private _promotion: PromotionResponse | null = null;
  private intervalId: any = null;
  countdownText = '';

  @Input() set promotion(value: PromotionResponse | null) {
    this._promotion = value;
    this.startCountdownInterval();
  }

  get promotion(): PromotionResponse | null {
    return this._promotion;
  }

  ngOnInit(): void {
    this.startCountdownInterval();
  }

  ngOnDestroy(): void {
    this.clearCountdownInterval();
  }

  private startCountdownInterval(): void {
    this.clearCountdownInterval();
    this.updateCountdown();
    if (this._promotion) {
      this.intervalId = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    }
  }

  private clearCountdownInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateCountdown(): void {
    if (!this._promotion) {
      this.countdownText = '';
      return;
    }

    if (this._promotion.deleted) {
      this.countdownText = 'Oculto (Eliminado)';
      return;
    }

    if (!this._promotion.enabled) {
      this.countdownText = 'Oculto (Deshabilitado)';
      return;
    }

    if (
      this._promotion.maxUses > 0 &&
      this._promotion.uses >= this._promotion.maxUses
    ) {
      this.countdownText = 'Agotado (Usos máximos alcanzados)';
      return;
    }

    const now = new Date();
    const start = new Date(
      this._promotion.startDate +
        (this._promotion.startDate.endsWith('Z') ? '' : 'Z'),
    );
    const end = new Date(
      this._promotion.endDate +
        (this._promotion.endDate.endsWith('Z') ? '' : 'Z'),
    );

    if (now > end) {
      const durationMs = end.getTime() - start.getTime();
      this.countdownText = `Finalizado (Estuvo activo por: ${this.formatDurationFriendly(durationMs)})`;
      return;
    }

    if (now < start) {
      const msUntilStart = start.getTime() - now.getTime();
      const durationMs = end.getTime() - start.getTime();
      this.countdownText = `Inicia en ${this.formatCountdownFriendly(msUntilStart)} (Estará activo por: ${this.formatDurationFriendly(durationMs)})`;
      return;
    }

    const msRemaining = end.getTime() - now.getTime();
    this.countdownText = `Quedan ${this.formatCountdownFriendly(msRemaining)}`;
  }

  private formatDurationFriendly(ms: number): string {
    if (ms <= 0) return '0 seg.';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      const remHours = hours % 24;
      return `${days} ${days === 1 ? 'día' : 'días'}${remHours > 0 ? ` y ${remHours} ${remHours === 1 ? 'hora' : 'horas'}` : ''}`;
    }
    if (hours > 0) {
      const remMinutes = minutes % 60;
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}${remMinutes > 0 ? ` y ${remMinutes} ${remMinutes === 1 ? 'minuto' : 'minutos'}` : ''}`;
    }
    if (minutes > 0) {
      const remSeconds = seconds % 60;
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}${remSeconds > 0 ? ` y ${remSeconds} seg.` : ''}`;
    }
    return `${seconds} seg.`;
  }

  private formatCountdownFriendly(ms: number): string {
    if (ms <= 0) return '0 seg.';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remSeconds = seconds % 60;
    const remMinutes = minutes % 60;
    const remHours = hours % 24;

    if (days > 0) {
      return `${days} ${days === 1 ? 'día' : 'días'}, ${remHours} ${remHours === 1 ? 'hora' : 'horas'} y ${remMinutes} min`;
    }
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}, ${remMinutes} min y ${remSeconds} seg.`;
    }
    if (minutes > 0) {
      return `${remMinutes} min y ${remSeconds} seg.`;
    }
    return `${remSeconds} seg.`;
  }

  get usagePercent(): number {
    if (
      !this._promotion ||
      !this._promotion.maxUses ||
      this._promotion.maxUses <= 0
    )
      return 0;
    const pct = (this._promotion.uses / this._promotion.maxUses) * 100;
    return Math.min(100, Math.max(0, pct));
  }

  get discountPercent(): number {
    if (
      !this._promotion ||
      !this._promotion.originalPrice ||
      this._promotion.originalPrice <= 0
    )
      return 0;
    const diff = this._promotion.originalPrice - this._promotion.finalPrice;
    return Math.round((diff / this._promotion.originalPrice) * 100);
  }

  getPromotionStatus(promotion: PromotionResponse): string {
    if (promotion.deleted) return 'Oculto';
    if (!promotion.enabled) return 'Oculto';

    const now = new Date();
    const start = new Date(
      promotion.startDate + (promotion.startDate.endsWith('Z') ? '' : 'Z'),
    );
    const end = new Date(
      promotion.endDate + (promotion.endDate.endsWith('Z') ? '' : 'Z'),
    );

    if (promotion.maxUses > 0 && promotion.uses >= promotion.maxUses) {
      return 'Finalizado';
    }

    if (now < start) {
      return 'Próximo';
    }

    if (now > end) {
      return 'Finalizado';
    }

    return 'Activo';
  }
}
