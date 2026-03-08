import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { ParcelDetails } from './models';

@Component({
  standalone: true,
  selector: 'app-parcel-detail',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container" *ngIf="details() as data">
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a routerLink="/" class="text-decoration-none">Parcelles</a></li>
          <li class="breadcrumb-item active" aria-current="page">{{ data.parcel.name }}</li>
        </ol>
      </nav>

      <section class="hero-card mb-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 class="h2 mb-1 text-success-emphasis" data-testid="parcel-title">{{ data.parcel.name }}</h1>
            <p class="mb-0 text-secondary">{{ data.parcel.location }} - {{ data.parcel.areaHectares }} ha</p>
          </div>
          <div class="d-flex gap-2">
            <button (click)="openForm('planting')" class="btn btn-outline-success">
              + Plantation
            </button>
            <button (click)="openForm('treatment')" class="btn btn-success">
              + Traitement
            </button>
          </div>
        </div>
      </section>

      <section class="card border-0 shadow-sm mb-3" *ngIf="activeForm() === 'planting'">
        <div class="card-body p-4">
          <h3 class="h5 mb-3">Nouveau semis</h3>
          <form [formGroup]="plantingForm" (ngSubmit)="submitPlanting()" data-testid="planting-create-form">
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <input formControlName="cropType" data-testid="planting-crop-input" placeholder="Culture" class="form-control">
              </div>
              <div class="col-12 col-md-4">
                <input type="date" formControlName="plantedAt" data-testid="planting-date-input" class="form-control">
              </div>
              <div class="col-12 col-md-4">
                <input type="number" formControlName="areaHectares" data-testid="planting-area-input" placeholder="Surface (ha)" class="form-control">
              </div>
              <div class="col-12 d-flex justify-content-end gap-2">
                <button type="button" (click)="activeForm.set(null)" class="btn btn-outline-secondary">Annuler</button>
                <button type="submit" data-testid="planting-submit-btn" class="btn btn-success">
                  Confirmer
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section class="card border-0 shadow-sm mb-3" *ngIf="activeForm() === 'treatment'">
        <div class="card-body p-4">
          <h3 class="h5 mb-3">Nouveau traitement</h3>
          <form [formGroup]="treatmentForm" (ngSubmit)="submitTreatment()" data-testid="treatment-create-form">
            <div class="row g-3">
              <div class="col-12 col-md-3">
                <input formControlName="treatmentType" data-testid="treatment-type-input" placeholder="Type" class="form-control">
              </div>
              <div class="col-12 col-md-3">
                <input type="date" formControlName="appliedAt" data-testid="treatment-date-input" class="form-control">
              </div>
              <div class="col-12 col-md-3">
                <input formControlName="dose" data-testid="treatment-dose-input" placeholder="Dose" class="form-control">
              </div>
              <div class="col-12 col-md-3">
                <input formControlName="notes" data-testid="treatment-notes-input" placeholder="Notes" class="form-control">
              </div>
              <div class="col-12 d-flex justify-content-end gap-2">
                <button type="button" (click)="activeForm.set(null)" class="btn btn-outline-secondary">Annuler</button>
                <button type="submit" data-testid="treatment-submit-btn" class="btn btn-success">
                  Confirmer
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <div class="row g-3 g-lg-4">
        <section class="col-12 col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h2 class="h4 mb-3 text-success-emphasis">Cultures</h2>
              <ul class="list-group list-group-flush" *ngIf="data.plantings.length > 0">
                <li
                  *ngFor="let pl of data.plantings; trackBy: trackByPlantingId"
                  class="list-group-item d-flex justify-content-between align-items-center px-0"
                  data-testid="planting-item"
                >
                  <div>
                    <p class="mb-0 fw-semibold text-dark">{{ pl.cropType }}</p>
                    <small class="text-secondary">{{ pl.plantedAt | date: 'dd/MM/yyyy' }}</small>
                  </div>
                  <span class="badge text-bg-success-subtle text-success-emphasis border">{{ pl.areaHectares }} ha</span>
                </li>
              </ul>
              <p class="text-secondary mb-0" *ngIf="data.plantings.length === 0">Aucune culture saisie pour le moment.</p>
            </div>
          </div>
        </section>

        <section class="col-12 col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h2 class="h4 mb-3 text-success-emphasis">Traitements</h2>
              <ul class="list-group list-group-flush" *ngIf="data.treatments.length > 0">
                <li
                  *ngFor="let tr of data.treatments; trackBy: trackByTreatmentId"
                  class="list-group-item px-0"
                  data-testid="treatment-item"
                >
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <p class="mb-0 fw-semibold text-dark">{{ tr.treatmentType }}</p>
                      <small class="text-secondary">{{ tr.appliedAt | date: 'dd/MM/yyyy' }}</small>
                    </div>
                    <span class="badge text-bg-primary-subtle text-primary-emphasis border">{{ tr.dose }}</span>
                  </div>
                </li>
              </ul>
              <p class="text-secondary mb-0" *ngIf="data.treatments.length === 0">Aucun traitement saisi pour le moment.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `
})
export class ParcelDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly details = signal<ParcelDetails | null>(null);
  readonly activeForm = signal<'planting' | 'treatment' | null>(null);

  readonly plantingForm = this.fb.nonNullable.group({
    cropType: ['', [Validators.required]],
    plantedAt: [new Date().toISOString().split('T')[0], Validators.required],
    areaHectares: [0, [Validators.required, Validators.min(0.1)]]
  });

  readonly treatmentForm = this.fb.nonNullable.group({
    treatmentType: ['', [Validators.required]],
    appliedAt: [new Date().toISOString().split('T')[0], Validators.required],
    dose: ['', [Validators.required]],
    notes: ['']
  });

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isNaN(id)) {
      return;
    }

    this.api.getParcel(id).subscribe((details) => {
      this.details.set(details);
      this.plantingForm.patchValue({ areaHectares: details.parcel.areaHectares });
    });
  }

  openForm(type: 'planting' | 'treatment'): void {
    this.activeForm.set(type);
  }

  submitPlanting(): void {
    const details = this.details();
    if (this.plantingForm.invalid || !details) {
      return;
    }

    this.api
      .createPlanting({
        parcelId: details.parcel.id,
        ...this.plantingForm.getRawValue()
      })
      .subscribe(() => {
        this.loadDetails();
        this.activeForm.set(null);
      });
  }

  submitTreatment(): void {
    const details = this.details();
    if (this.treatmentForm.invalid || !details) {
      return;
    }

    this.api
      .createTreatment({
        parcelId: details.parcel.id,
        plantingId: details.plantings[0]?.id ?? null,
        treatmentType: this.treatmentForm.getRawValue().treatmentType,
        appliedAt: this.treatmentForm.getRawValue().appliedAt,
        dose: this.treatmentForm.getRawValue().dose,
        notes: this.treatmentForm.getRawValue().notes || null
      })
      .subscribe(() => {
        this.loadDetails();
        this.activeForm.set(null);
      });
  }

  trackByPlantingId(_index: number, item: NonNullable<ParcelDetails['plantings'][number]>): number {
    return item.id;
  }

  trackByTreatmentId(_index: number, item: NonNullable<ParcelDetails['treatments'][number]>): number {
    return item.id;
  }
}
