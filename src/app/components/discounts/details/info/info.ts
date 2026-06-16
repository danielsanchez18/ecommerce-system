import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ComponentSharedStates } from '@components/shared/states/states';
import { DiscountResponse } from '@core/interfaces/discounts/discount.interface';
import {
  LucideBadgeCheck,
  LucideBadgeMinus,
  LucideBadgePercent,
  LucideCalendarClock,
  LucideCircleCheck,
  LucideClock,
  LucideTag,
} from '@lucide/angular';

@Component({
  selector: 'component-discounts-details-info',
  imports: [
    CommonModule,
    LucideBadgeCheck,
    LucideTag,
    ComponentSharedStates,
    LucideClock,
    LucideCircleCheck,
    LucideBadgePercent,
    LucideBadgeMinus,
    LucideCalendarClock,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './info.html',
})
export class ComponentDiscountsDetailsInfo implements OnInit, OnDestroy {
  private _discount: DiscountResponse | null = null;
  private intervalId: any = null;
  countdownText = '';

  @Input() set discount(value: DiscountResponse | null) {
    this._discount = value;
    this.startCountdownInterval();
  }

  get discount(): DiscountResponse | null {
    return this._discount;
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
    if (this._discount) {
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
    if (!this._discount) {
      this.countdownText = '';
      return;
    }

    if (this._discount.deleted) {
      this.countdownText = 'Oculto (Eliminado)';
      return;
    }

    if (!this._discount.enabled) {
      this.countdownText = 'Oculto (Deshabilitado)';
      return;
    }

    if (
      this._discount.maxUses > 0 &&
      this._discount.uses >= this._discount.maxUses
    ) {
      this.countdownText = 'Agotado (Usos máximos alcanzados)';
      return;
    }

    const now = new Date();
    const start = new Date(
      this._discount.startDate +
        (this._discount.startDate.endsWith('Z') ? '' : 'Z'),
    );
    const end = new Date(
      this._discount.endDate +
        (this._discount.endDate.endsWith('Z') ? '' : 'Z'),
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

  getDurationInDays(startStr: string, endStr: string): number {
    if (!startStr || !endStr) return 0;
    const start = new Date(startStr + (startStr.endsWith('Z') ? '' : 'Z'));
    const end = new Date(endStr + (endStr.endsWith('Z') ? '' : 'Z'));
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDiscountStatus(discount: DiscountResponse): string {
    if (discount.deleted) return 'Oculto';
    if (!discount.enabled) return 'Oculto';

    const now = new Date();
    const start = new Date(
      discount.startDate + (discount.startDate.endsWith('Z') ? '' : 'Z'),
    );
    const end = new Date(
      discount.endDate + (discount.endDate.endsWith('Z') ? '' : 'Z'),
    );

    if (discount.maxUses > 0 && discount.uses >= discount.maxUses) {
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
