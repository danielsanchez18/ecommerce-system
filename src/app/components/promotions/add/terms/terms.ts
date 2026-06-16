import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideFileQuestion, LucideTrash2 } from '@lucide/angular';
import { PromotionRequest } from '@core/interfaces/promotions/promotion.interface';

@Component({
  selector: 'component-promotions-add-terms',
  imports: [CommonModule, FormsModule, LucideTrash2, LucideFileQuestion],
  templateUrl: './terms.html',
})
export class ComponentPromotionsAddTerms {
  @Input() promotion!: PromotionRequest;

  newTerm: string = '';
  removingTermIndexes: number[] = [];

  // Añadir término nuevo
  addTerm() {
    const trimmed = this.newTerm.trim();
    if (trimmed) {
      if (!this.promotion.terms) {
        this.promotion.terms = [];
      }
      this.promotion.terms.push(trimmed);
      this.newTerm = '';
    }
  }

  // Eliminar término por índice
  removeTerm(index: number) {
    this.removingTermIndexes.push(index);

    setTimeout(() => {
      if (this.promotion.terms) {
        this.promotion.terms.splice(index, 1);
      }
      this.removingTermIndexes = this.removingTermIndexes.filter(
        (i) => i !== index,
      );
    }, 300);
  }
}
