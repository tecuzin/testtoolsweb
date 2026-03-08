import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';
import { Parcel } from './models';

@Component({
  standalone: true,
  selector: 'app-parcel-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="card">
      <h2>Ajouter une parcelle</h2>
      <form [formGroup]="form" (ngSubmit)="create()" data-testid="parcel-create-form">
        <label for="name">Nom</label>
        <input id="name" formControlName="name" data-testid="parcel-name-input" />

        <label for="area">Surface (ha)</label>
        <input id="area" type="number" formControlName="areaHectares" data-testid="parcel-area-input" />

        <label for="location">Localisation</label>
        <input id="location" formControlName="location" data-testid="parcel-location-input" />

        <button type="submit" [disabled]="form.invalid" data-testid="parcel-submit-btn">Créer la parcelle</button>
      </form>
    </section>

    <section class="card">
      <h2>Parcelles</h2>
      <ul>
        <li *ngFor="let parcel of parcels" data-testid="parcel-item">
          <a [routerLink]="['/parcels', parcel.id]">{{ parcel.name }}</a>
          <small> - {{ parcel.areaHectares }} ha ({{ parcel.location }})</small>
        </li>
      </ul>
    </section>
  `
})
export class ParcelListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  parcels: Parcel[] = [];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    areaHectares: [0, [Validators.required, Validators.min(0.1)]],
    location: ['', [Validators.required, Validators.minLength(2)]]
  });

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.api.listParcels().subscribe((items) => (this.parcels = items));
  }

  create(): void {
    if (this.form.invalid) {
      return;
    }

    this.api.createParcel(this.form.getRawValue()).subscribe(() => {
      this.form.reset({ name: '', areaHectares: 0, location: '' });
      this.refresh();
    });
  }
}
