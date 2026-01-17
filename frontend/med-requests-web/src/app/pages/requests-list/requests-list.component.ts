import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RequestsService, RequestListItemDto } from '../../core/requests.service';

@Component({
  standalone: true,
  selector: 'app-requests-list',
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <div class="row">
      <h2>Solicitudes</h2>
      <a class="btn" routerLink="/requests/new">+ Nueva</a>
    </div>

    <p class="error" *ngIf="error">{{ error }}</p>

    <table *ngIf="items.length" class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Medicamento</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Orden</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let r of items">
          <td>{{ r.id }}</td>
          <td>{{ r.medicationName }}</td>
          <td>{{ r.noPos ? 'NO POS' : 'POS' }}</td>
          <td>{{ r.createdAt }}</td>
          <td>{{ r.orderNumber || '-' }}</td>
          <td>{{ r.address || '-' }}</td>
          <td>{{ r.phone || '-' }}</td>
          <td>{{ r.contactEmail || '-' }}</td>
        </tr>
      </tbody>
    </table>

    <p *ngIf="!items.length && !error">Sin solicitudes</p>

    <div class="pager" *ngIf="totalPages > 1">
      <button (click)="prev()" [disabled]="page === 0">Prev</button>
      <span>Página {{ page + 1 }} / {{ totalPages }}</span>
      <button (click)="next()" [disabled]="page >= totalPages - 1">Next</button>
    </div>
  `,
  styles: [`
    .row { display:flex; justify-content:space-between; align-items:center; }
    .btn { background:#2563eb; color:#fff; padding:8px 12px; border-radius:10px; text-decoration:none; }
    .table { width:100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border-bottom: 1px solid #eee; padding: 8px; text-align:left; font-size: 14px; }
    th { background: #fafafa; }
    .pager { display:flex; gap:10px; align-items:center; margin-top: 12px; }
    button { padding:8px 10px; border-radius:10px; border:1px solid #ddd; background:#fff; cursor:pointer; }
    button[disabled] { opacity:.6; cursor:not-allowed; }
    .error { color:#dc2626; }
  `]
})
export class RequestsListComponent implements OnInit {
  private api = inject(RequestsService);

  items: RequestListItemDto[] = [];
  error = '';

  page = 0;
  size = 10;
  totalPages = 0;

  ngOnInit() {
    this.load();
  }

  load() {
    this.error = '';
    this.api.listRequests(this.page, this.size).subscribe({
      next: (res) => {
        this.items = res.content;
        this.totalPages = res.totalPages;
        this.page = res.number;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo cargar solicitudes';
      },
    });
  }

  next() {
    if (this.page >= this.totalPages - 1) return;
    this.page++;
    this.load();
  }

  prev() {
    if (this.page <= 0) return;
    this.page--;
    this.load();
  }
}
