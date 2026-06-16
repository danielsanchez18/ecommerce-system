import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideInfo } from '@lucide/angular';

@Component({
  selector: 'component-roles-add-info',
  imports: [CommonModule, ReactiveFormsModule, LucideInfo],
  templateUrl: './info.html',
})
export class ComponentRolesAddInfo {
  @Input() infoForm!: FormGroup | any;
}
