import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LucideUsers,
  LucideUserCog,
  LucideActivity,
  LucideFileClock,
  LucideLayoutDashboard,
  LucideDynamicIcon,
  LucidePackage,
  LucideTag,
  LucideShoppingBag,
  LucideStore,
  LucideConciergeBell,
  LucideTags,
  LucideBadgePercent,
  LucideGift,
  LucideHandCoins,
  LucideBadgeDollarSign,
  LucideStar,
  LucideBadgeAlert,
} from '@lucide/angular';

@Component({
  selector: 'component-shared-sidebar',
  imports: [
    RouterModule,
    CommonModule,
    LucideDynamicIcon,
    LucideLayoutDashboard,
  ],
  templateUrl: './sidebar.html',
})
export class ComponentSharedSidebar {
  /* routes = [
    {
      nameCategory: 'Pedidos',
      links: [
        { name: 'Pedidos', path: 'pedidos', icon: LucideShoppingBag },
        { name: 'Mesas', path: 'mesas', icon: LucideStore },
        {
          name: 'Pedidos Presenciales',
          path: 'pedidos-presenciales',
          icon: LucideConciergeBell,
        },
      ],
    },
    {
      nameCategory: 'Productos',
      links: [
        { name: 'Productos', path: 'productos', icon: LucidePackage },
        { name: 'Categorias', path: 'categorias', icon: LucideTag },
      ],
    },
    {
      nameCategory: 'Usuarios y Seguridad',
      links: [
        { name: 'Usuarios', path: 'usuarios', icon: LucideUsers },
        { name: 'Roles', path: 'roles', icon: LucideUserCog },
        { name: 'Auditoría', path: 'auditoria', icon: LucideActivity },
        { name: 'Logs', path: 'logs', icon: LucideFileClock },
      ],
    },
  ]; */

  routes = [
    { name: 'Categorías', path: 'categorias', icon: LucideTags },
    { name: 'Productos', path: 'productos', icon: LucidePackage },
    { name: 'Descuentos', path: 'descuentos', icon: LucideBadgePercent },
    { name: 'Promociones', path: 'promociones', icon: LucideGift },
    { name: 'Pedidos', path: 'pedidos', icon: LucideShoppingBag },
    { name: 'Restaurante', path: 'restaurante', icon: LucideStore },
    { name: 'Facturación', path: 'facturacion', icon: LucideBadgeDollarSign },
    { name: 'Reseñas', path: 'reseñas', icon: LucideStar },
    { name: 'Reclamos', path: 'reclamos', icon: LucideBadgeAlert },
    { name: 'Usuarios', path: 'usuarios', icon: LucideUsers },
    { name: 'Roles', path: 'roles', icon: LucideUserCog },
  ];
}
