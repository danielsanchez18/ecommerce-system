import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentSharedNavbar } from '@components/shared/navbar/navbar';

@Component({
  selector: 'layout-delivery',
  imports: [RouterOutlet, ComponentSharedNavbar],
  templateUrl: './delivery.html',
})
export class LayoutDelivery {}
