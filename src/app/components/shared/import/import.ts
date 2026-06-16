import { Component } from '@angular/core';
import { LucideArrowUpDown, LucideChevronDown } from '@lucide/angular';

@Component({
  selector: 'component-shared-import',
  imports: [LucideArrowUpDown, LucideChevronDown],
  templateUrl: './import.html',
})
export class ComponentSharedImport {}
