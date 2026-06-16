import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentSharedSidebar } from '@components/shared/sidebar/sidebar';
import { ComponentSharedNavbar } from '@components/shared/navbar/navbar';

@Component({
  selector: 'layout-dashboard',
  imports: [RouterOutlet, ComponentSharedSidebar, ComponentSharedNavbar],
  templateUrl: './dashboard.html',
})
export class LayoutDashboard {}
