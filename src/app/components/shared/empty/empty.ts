import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-shared-empty',
  imports: [],
  templateUrl: './empty.html',
})
export class ComponentSharedEmpty {
  @Input() title: string = 'No hay datos';
  @Input() message: string =
    'Registra una nueva solicitud para empezar a gestionar tu sistema';
}
