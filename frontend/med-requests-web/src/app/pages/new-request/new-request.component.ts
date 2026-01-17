import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { RequestsService, Medication } from '../../core/requests.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-new-request',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  template: `
    <h2>Nueva solicitud</h2>

    <form [formGroup]="form" (ngSubmit)="submit()" class="card">
      <label>Medicamento</label>
      <select formControlName="medicationId" (change)="onMedChange()">
        <option value="">-- Selecciona --</option>
        <option *ngFor="let m of medications" [value]="m.id">
          {{ m.name }} {{ m.noPos ? '(NO POS)' : '(POS)' }}
        </option>
      </select>

      <div class="hint" *ngIf="selectedMed">
        Seleccionado: <b>{{ selectedMed.name }}</b> - {{ selectedMed.noPos ? 'NO POS' : 'POS' }}
      </div>

      <div *ngIf="selectedMed?.noPos" class="nopos">
        <h3>Datos adicionales (NO POS)</h3>

        <label>Número de orden</label>
        <input formControlName="orderNumber" type="text" />

        <label>Dirección</label>
        <input formControlName="address" type="text" />

        <label>Teléfono</label>
        <input formControlName="phone" type="text" />

        <label>Correo electrónico</label>
        <input formControlName="contactEmail" type="email" />
      </div>

      <button type="submit" [disabled]="form.invalid || loading">
        {{ loading ? 'Enviando...' : 'Crear solicitud' }}
      </button>

      <p class="error" *ngIf="error">{{ error }}</p>
      <p class="ok" *ngIf="ok">{{ ok }}</p>
    </form>
  `,
  styles: [`
    .card { display:flex; flex-direction:column; gap:8px; max-width: 520px; padding:16px; border:1px solid #e5e5e5; border-radius:12px; }
    select, input { padding:10px; border-radius:10px; border:1px solid #ddd; }
    button { margin-top: 8px; padding:10px; border-radius:10px; border:none; background:#2563eb; color:white; cursor:pointer; }
    button[disabled] { opacity:.6; cursor:not-allowed; }
    .hint { color:#444; font-size: 14px; margin-bottom: 6px; }
    .nopos { margin-top: 8px; padding: 12px; border: 1px dashed #ccc; border-radius: 12px; display: grid }
    .error { color:#dc2626; margin: 8px 0 0; }
    .ok { color:#16a34a; margin: 8px 0 0; }
  `]
})
export class NewRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(RequestsService);
  private router = inject(Router);

  medications: Medication[] = [];
  selectedMed?: Medication;

  loading = false;
  error = '';
  ok = '';

  form = this.fb.group({
    medicationId: ['', [Validators.required]],
    orderNumber: [''],
    address: [''],
    phone: [''],
    contactEmail: [''],
  });

  ngOnInit() {
    this.api.listMedications().subscribe({
      next: (list) => (this.medications = list),
      error: () => (this.error = 'No se pudo cargar medicamentos'),
    });
  }

  onMedChange() {
    const id = Number(this.form.get('medicationId')?.value);
    this.selectedMed = this.medications.find(m => m.id === id);

    const orderNumber = this.form.get('orderNumber');
    const address = this.form.get('address');
    const phone = this.form.get('phone');
    const contactEmail = this.form.get('contactEmail');

    orderNumber?.clearValidators();
    address?.clearValidators();
    phone?.clearValidators();
    contactEmail?.clearValidators();

    if (this.selectedMed?.noPos) {
      orderNumber?.addValidators([Validators.required]);
      address?.addValidators([Validators.required]);
      phone?.addValidators([Validators.required]);
      contactEmail?.addValidators([Validators.required, Validators.email]);
    } else {
      orderNumber?.setValue('');
      address?.setValue('');
      phone?.setValue('');
      contactEmail?.setValue('');
    }

    orderNumber?.updateValueAndValidity();
    address?.updateValueAndValidity();
    phone?.updateValueAndValidity();
    contactEmail?.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.ok = '';

    const raw = this.form.getRawValue();
    const dto = {
      medicationId: Number(raw.medicationId),
      orderNumber: raw.orderNumber || undefined,
      address: raw.address || undefined,
      phone: raw.phone || undefined,
      contactEmail: raw.contactEmail || undefined,
    };

    this.api.createRequest(dto).subscribe({
      next: () => {
        this.ok = 'Solicitud creada';
        this.loading = false;
        setTimeout(() => this.router.navigateByUrl('/requests'), 400);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'No se pudo crear la solicitud';
        this.loading = false;
      },
    });
  }
}
