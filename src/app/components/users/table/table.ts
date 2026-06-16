import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideBadgeCheck,
  LucideBadgeMinus,
  LucideBadgeX,
  LucideUserCog,
} from '@lucide/angular';
import { UserDetail } from '../list/list';

@Component({
  selector: 'component-users-table',
  imports: [
    CommonModule,
    RouterLink,
    LucideUserCog,
    LucideBadgeCheck,
    LucideBadgeX,
    LucideBadgeMinus,
  ],
  templateUrl: './table.html',
})
export class ComponentUsersTable {
  @Input() users: UserDetail[] = [];
}
