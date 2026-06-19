import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentCategoriesList } from '@components/categories/list/list';
import { ComponentComplaintsList } from '@components/complaints/list/list';
import { ComponentOrdersList } from '@components/orders/list/list';
import { ComponentProductsList } from '@components/products/list/list';
import { ComponentUsersList } from '@components/users/list/list';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideDynamicIcon,
  LucidePackage2,
  LucideShoppingBag,
  LucideTag,
  LucideTriangleAlert,
  LucideUsersRound,
} from '@lucide/angular';

@Component({
  selector: 'component-overview-table',
  imports: [
    LucideShoppingBag,
    LucidePackage2,
    LucideTag,
    LucideUsersRound,
    LucideTriangleAlert,
    LucideDynamicIcon,
    CommonModule,
    LucideChevronLeft,
    LucideChevronRight,
    RouterLink,
    ComponentOrdersList,
    ComponentProductsList,
    ComponentCategoriesList,
    ComponentUsersList,
    ComponentComplaintsList,
  ],
  templateUrl: './table.html',
})
export class ComponentOverviewTable {
  categories = [
    {
      name: 'Pedidos',
      icon: LucideShoppingBag,
      title: 'Pedidos Recientes',
      link: 'pedidos',
      isActive: true,
      description: 'Revisa los pedidos últimos pedidos realizados',
    },

    {
      name: 'Productos',
      icon: LucidePackage2,
      title: 'Productos Populares',
      link: 'productos',
      isActive: false,
      description: 'Hecha a un vistazo a los productos más populares',
    },

    {
      name: 'Categorias',
      icon: LucideTag,
      title: 'Categorías',
      link: 'categorias',
      isActive: false,
      description: 'Revisa las categorías de los productos',
    },

    {
      name: 'Usuarios',
      icon: LucideUsersRound,
      title: 'Usuarios Recientes',
      link: 'usuarios',
      isActive: false,
      description: 'Revisa el reporte de usuarios y sus roles',
    },

    {
      name: 'Denuncias',
      icon: LucideTriangleAlert,
      title: 'Denuncias',
      link: 'denucias',
      isActive: false,
      description: 'Reporte de las denuncias hechas por los usuarios',
    },
  ];

  categoryActive: any = this.categories.find((category) => category.isActive);

  categorySelect(selectedCategory: any) {
    this.categories.forEach((category) => {
      category.isActive = category === selectedCategory;
    });
    this.categoryActive = selectedCategory;
  }

  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;

  showLeftArrow = false;
  showRightArrow = false;

  ngAfterViewInit() {
    setTimeout(() => this.updateArrows(), 0);
  }

  onScroll() {
    this.updateArrows();
  }

  updateArrows() {
    const el = this.scrollContainer.nativeElement;
    this.showLeftArrow = el.scrollLeft > 0;
    this.showRightArrow = el.scrollLeft + el.clientWidth < el.scrollWidth;
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  }
}
