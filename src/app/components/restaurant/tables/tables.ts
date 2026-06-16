import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucidePlus, LucideUsers } from '@lucide/angular';
import { ComponentRestaurantAddTable } from '../add-table/add-table';
import { TableService } from '@core/service/tables/table.service';
import { TableResponse } from '@core/interfaces/tables/table.interface';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { OrderCartService } from '@core/service/orders/order-cart.service';
import { OrderService } from '@core/service/orders/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-restaurant-tables',
  imports: [
    CommonModule,
    LucideUsers,
    LucidePlus,
    ComponentRestaurantAddTable,
    DragDropModule,
  ],
  templateUrl: './tables.html',
})
export class ComponentRestaurantTables implements OnInit {
  private readonly tableService = inject(TableService);
  private readonly orderCartService = inject(OrderCartService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  tables: TableResponse[] = [];
  mergedGroups: TableResponse[][] = [];

  ngOnInit() {
    this.loadTables();
  }

  loadTables() {
    this.tableService.getAll({ size: 100 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const allTables = res.data.content;
          this.processTables(allTables);
        }
      },
    });
  }

  private processTables(allTables: TableResponse[]) {
    const normalTables: TableResponse[] = [];
    const mergedMap = new Map<string, TableResponse[]>();

    for (const table of allTables) {
      if (table.mergedWithTableId) {
        const rootId = table.mergedWithTableId;
        if (!mergedMap.has(rootId)) {
          mergedMap.set(rootId, []);
        }
        mergedMap.get(rootId)!.push(table);
      } else {
        const isRoot = allTables.some((t) => t.mergedWithTableId === table.id);
        if (isRoot) {
          if (!mergedMap.has(table.id)) {
            mergedMap.set(table.id, []);
          }
          mergedMap.get(table.id)!.push(table);
        } else {
          normalTables.push(table);
        }
      }
    }

    this.tables = normalTables;
    this.mergedGroups = Array.from(mergedMap.values());
  }

  onDrop(event: CdkDragDrop<TableResponse, any, TableResponse>) {
    // Si lo suelta en su propio lugar, no hacer nada
    if (event.previousContainer === event.container) {
      return;
    }

    const draggedTable = event.item.data;
    const targetTable = event.container.data;

    if (!draggedTable || !targetTable) return;

    Swal.fire({
      title: '¿Unir mesas?',
      text: `¿Deseas unir la Mesa ${draggedTable.tableNumber} con la Mesa ${targetTable.tableNumber}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, unir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al backend para unir las mesas
        this.tableService
          .mergeTables(targetTable.id, draggedTable.id)
          .subscribe({
            next: (res) => {
              if (res.success) {
                Swal.fire(
                  '¡Mesas unidas!',
                  'Las mesas se unieron exitosamente',
                  'success',
                );
                this.loadTables();
              }
            },
            error: () => {
              Swal.fire('Error', 'No se pudieron unir las mesas', 'error');
              this.loadTables(); // Reload to reset UI
            },
          });
      }
    });
  }

  separateTable(table: TableResponse, event: Event) {
    event.stopPropagation(); // Prevenir que el clic se propague al grupo de mesas
    Swal.fire({
      title: '¿Separar mesa?',
      text: `¿Deseas separar la Mesa ${table.tableNumber}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, separar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tableService.unmergeTable(table.id).subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire('¡Mesa separada!', 'La mesa se separó exitosamente', 'success');
              this.loadTables();
            }
          },
          error: () => {
            Swal.fire('Error', 'No se pudo separar la mesa', 'error');
            this.loadTables();
          },
        });
      }
    });
  }

  // --- Selección para Pedido ---
  selectTableForOrder(table: TableResponse) {
    if (table.status !== 'AVAILABLE') {
      // Opcional: mostrar un warning o permitir ver cuenta
      return;
    }
    this.orderCartService.setTables([table]);
    this.router.navigate(['/dashboard/restaurante/pedido']);
  }

  selectMergedGroupForOrder(group: TableResponse[]) {
    this.orderCartService.setTables(group);
    this.router.navigate(['/dashboard/restaurante/order']);
  }

  viewAccount(table: TableResponse, event: Event) {
    event.stopPropagation();
    const tableIdToQuery = table.mergedWithTableId ? table.mergedWithTableId : table.id;

    this.orderService.getAll({ tableId: tableIdToQuery, size: 5, sort: 'createdAt,desc' } as any).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.content.length > 0) {
          const activeOrder = res.data.content.find(o => 
            o.status === 'PENDING' || o.status === 'PREPARING' || o.status === 'READY'
          );
          
          if (activeOrder) {
            this.router.navigate(['/dashboard/pedidos', activeOrder.id]);
          } else {
            Swal.fire('Info', 'No se encontró un pedido activo para esta mesa.', 'info');
          }
        } else {
          Swal.fire('Info', 'No hay pedidos registrados para esta mesa.', 'info');
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudo obtener el pedido de la mesa.', 'error');
      }
    });
  }
}
