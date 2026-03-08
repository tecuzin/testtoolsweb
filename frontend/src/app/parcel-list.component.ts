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
      <div class="section-top">
        <h2>Ajouter une parcelle</h2>
        <span class="kpi">Etape 1</span>
      </div>
      <p class="muted">
        Commencez ici pour creer une nouvelle parcelle avec sa surface et sa localisation.
      </p>
      <form [formGroup]="form" (ngSubmit)="create()" data-testid="parcel-create-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Nom de la parcelle</label>
            <input id="name" formControlName="name" data-testid="parcel-name-input" />
            <small class="help-text">Exemple: Parcelle Nord</small>
          </div>

          <div class="form-group">
            <label for="area">Surface (ha)</label>
            <input id="area" type="number" formControlName="areaHectares" data-testid="parcel-area-input" />
            <small class="help-text">Minimum 0,1 hectare</small>
          </div>

          <div class="form-group">
            <label for="location">Localisation</label>
            <input id="location" formControlName="location" data-testid="parcel-location-input" />
            <small class="help-text">Commune ou zone de culture</small>
          </div>
        </div>

        <div class="button-row">
          <button type="submit" [disabled]="form.invalid" data-testid="parcel-submit-btn">Creer la parcelle</button>
        </div>
      </form>
    </section>

    <section class="card">
      <div class="section-top">
        <h2>Parcelles</h2>
        <span class="kpi">{{ parcels.length }} total</span>
      </div>
      <p class="muted">Selectionnez une parcelle pour voir son detail et ajouter des operations.</p>

      <p class="empty-state" *ngIf="parcels.length === 0">
        Aucune parcelle enregistree pour le moment.
      </p>

      <ul class="list-clean" *ngIf="parcels.length > 0">
        <li class="list-item" *ngFor="let parcel of parcels" data-testid="parcel-item">
          <a class="parcel-name" [routerLink]="['/parcels', parcel.id]">{{ parcel.name }}</a>
          <small class="muted">{{ parcel.areaHectares }} ha - {{ parcel.location }}</small>
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
