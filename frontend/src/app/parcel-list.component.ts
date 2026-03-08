import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';
import { Parcel } from './models';

@Component({
  standalone: true,
  selector: 'app-parcel-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <section class="hero-card mb-4 mb-md-5">
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h1 class="h2 mb-1 text-success-emphasis">Mes Parcelles</h1>
            <p class="mb-0 text-secondary">Gerez vos terres et suivez vos activites agricoles.</p>
          </div>
          <button
            type="button"
            (click)="showCreateForm.set(!showCreateForm())"
            class="btn btn-success btn-lg"
          >
            + Ajouter une parcelle
          </button>
        </div>
      </section>

      <section class="card shadow-sm border-0 mb-4" *ngIf="showCreateForm()">
        <div class="card-body p-4 p-md-5">
          <h2 class="h4 mb-4 text-success-emphasis">Nouvelle parcelle</h2>
          <form [formGroup]="parcelForm" (ngSubmit)="onSubmit()" data-testid="parcel-create-form">
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <label class="form-label" for="name">Nom de la parcelle</label>
                <input id="name" formControlName="name" data-testid="parcel-name-input" placeholder="ex: Le Grand Clos" class="form-control">
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label" for="area">Surface (ha)</label>
                <input id="area" type="number" formControlName="areaHectares" data-testid="parcel-area-input" placeholder="ex: 4.5" class="form-control">
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label" for="location">Localisation</label>
                <input id="location" formControlName="location" data-testid="parcel-location-input" placeholder="Coordonnees ou lieu-dit" class="form-control">
              </div>
              <div class="col-12 d-flex justify-content-end gap-2 pt-2">
                <button type="button" (click)="showCreateForm.set(false)" class="btn btn-outline-secondary">Annuler</button>
                <button [disabled]="parcelForm.invalid" type="submit" data-testid="parcel-submit-btn" class="btn btn-success">
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h4 mb-0 text-success-emphasis">Parcelles</h2>
          <span class="badge text-bg-light border">{{ parcels().length }} total</span>
        </div>

        <div class="row g-3" *ngIf="parcels().length > 0">
          <div class="col-12 col-md-6 col-xl-4" *ngFor="let p of parcels(); trackBy: trackByParcelId">
            <a
              [routerLink]="['/parcels', p.id]"
              class="card h-100 border-0 shadow-sm text-decoration-none parcel-card"
              data-testid="parcel-item"
            >
              <div class="card-body">
                <h3 class="h5 mb-3 text-dark">{{ p.name }}</h3>
                <div class="d-flex flex-wrap gap-2 align-items-center text-secondary small">
                  <span class="badge rounded-pill text-bg-success-subtle text-success-emphasis border">{{ p.areaHectares }} ha</span>
                  <span>{{ p.location }}</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div class="card border-0 shadow-sm" *ngIf="parcels().length === 0">
          <div class="card-body py-5 text-center text-secondary">
            <h3 class="h5 mb-0">Aucune parcelle trouvee</h3>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ParcelListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly parcels = signal<Parcel[]>([]);
  readonly showCreateForm = signal(false);

  readonly parcelForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    areaHectares: [0, [Validators.required, Validators.min(0.1)]],
    location: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadParcels();
  }

  loadParcels(): void {
    this.api.getParcels().subscribe((items) => this.parcels.set(items));
  }

  onSubmit(): void {
    if (this.parcelForm.invalid) {
      return;
    }

    this.api.createParcel(this.parcelForm.getRawValue()).subscribe(() => {
      this.loadParcels();
      this.parcelForm.reset({ name: '', areaHectares: 0, location: '' });
      this.showCreateForm.set(false);
    });
  }

  trackByParcelId(_index: number, item: Parcel): number {
    return item.id;
  }
}
