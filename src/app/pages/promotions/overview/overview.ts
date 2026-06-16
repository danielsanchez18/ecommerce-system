import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentPromotionsList } from '@components/promotions/list/list';

@Component({
  selector: 'page-promotions-overview',
  imports: [RouterLink, ComponentPromotionsList],
  templateUrl: './overview.html',
})
export class PagePromotionsOverview {}
