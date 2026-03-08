import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { ParcelDetails } from './models';

@Component({
  standalone: true,
  selector: 'app-parcel-detail',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="card" *ngIf="details">
      <div class="section-top">
        <h2 data-testid="parcel-title">{{ details.parcel.name }}</h2>
        <span class="kpi">Etape 2</span>
      </div>
      <p class="muted">Surface: {{ details.parcel.areaHectares }} ha</p>
      <p class="muted">Localisation: {{ details.parcel.location }}</p>
      <a class="nav-link" routerLink="/">Retour a la liste</a>
    </section>

    <section class="grid-2" *ngIf="details">
      <article class="card">
        <div class="section-top">
          <h3>Ajouter une plantation</h3>
          <span class="kpi">{{ details.plantings.length }} enregistree(s)</span>
        </div>
        <p class="muted">Renseignez la culture semee et la surface concernee.</p>
        <form [formGroup]="plantingForm" (ngSubmit)="addPlanting()" data-testid="planting-create-form">
          <div class="form-group">
            <label for="crop">Culture</label>
            <input id="crop" formControlName="cropType" data-testid="planting-crop-input" />
            <small class="help-text">Exemple: Ble tendre, Mais grain...</small>
          </div>

          <div class="form-group">
            <label for="plantedAt">Date de semis</label>
            <input id="plantedAt" type="date" formControlName="plantedAt" data-testid="planting-date-input" />
          </div>

          <div class="form-group">
            <label for="plantingArea">Surface (ha)</label>
            <input id="plantingArea" type="number" formControlName="areaHectares" data-testid="planting-area-input" />
          </div>

          <div class="button-row">
            <button type="submit" [disabled]="plantingForm.invalid" data-testid="planting-submit-btn">Ajouter</button>
          </div>
        </form>

        <p class="empty-state" *ngIf="details.plantings.length === 0">
          Aucune plantation enregistree.
        </p>

        <ul class="list-clean" *ngIf="details.plantings.length > 0">
          <li class="list-item" *ngFor="let planting of details.plantings" data-testid="planting-item">
            {{ planting.cropType }} - {{ planting.areaHectares }} ha
          </li>
        </ul>
      </article>

      <article class="card">
        <div class="section-top">
          <h3>Ajouter un traitement</h3>
          <span class="kpi">{{ details.treatments.length }} enregistre(s)</span>
        </div>
        <p class="muted">Suivez les interventions appliquees a la parcelle.</p>
        <form [formGroup]="treatmentForm" (ngSubmit)="addTreatment()" data-testid="treatment-create-form">
          <div class="form-group">
            <label for="type">Type de traitement</label>
            <input id="type" formControlName="treatmentType" data-testid="treatment-type-input" />
          </div>

          <div class="form-group">
            <label for="appliedAt">Date d'application</label>
            <input id="appliedAt" type="date" formControlName="appliedAt" data-testid="treatment-date-input" />
          </div>

          <div class="form-group">
            <label for="dose">Dose</label>
            <input id="dose" formControlName="dose" data-testid="treatment-dose-input" />
          </div>

          <div class="form-group">
            <label for="notes">Notes</label>
            <input id="notes" formControlName="notes" data-testid="treatment-notes-input" />
          </div>

          <div class="button-row">
            <button type="submit" [disabled]="treatmentForm.invalid" data-testid="treatment-submit-btn">Ajouter</button>
          </div>
        </form>

        <p class="empty-state" *ngIf="details.treatments.length === 0">
          Aucun traitement enregistre.
        </p>

        <ul class="list-clean" *ngIf="details.treatments.length > 0">
          <li class="list-item" *ngFor="let treatment of details.treatments" data-testid="treatment-item">
            {{ treatment.treatmentType }} - {{ treatment.dose }}
          </li>
        </ul>
      </article>
    </section>
  `
})
export class ParcelDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  details: ParcelDetails | null = null;
  parcelId = 0;

  readonly plantingForm = this.fb.nonNullable.group({
    cropType: ['', [Validators.required, Validators.minLength(2)]],
    plantedAt: ['', Validators.required],
    areaHectares: [0, [Validators.required, Validators.min(0.1)]]
  });

  readonly treatmentForm = this.fb.nonNullable.group({
    treatmentType: ['', [Validators.required, Validators.minLength(2)]],
    appliedAt: ['', Validators.required],
    dose: ['', [Validators.required, Validators.minLength(2)]],
    notes: ['']
  });

  ngOnInit(): void {
    this.parcelId = Number(this.route.snapshot.paramMap.get('id'));
    this.refresh();
  }

  refresh(): void {
    this.api.getParcelDetails(this.parcelId).subscribe((details) => {
      this.details = details;
    });
  }

  addPlanting(): void {
    if (this.plantingForm.invalid || !this.details) {
      return;
    }

    this.api
      .createPlanting({
        parcelId: this.details.parcel.id,
        ...this.plantingForm.getRawValue()
      })
      .subscribe(() => {
        this.plantingForm.reset({ cropType: '', plantedAt: '', areaHectares: 0 });
        this.refresh();
      });
  }

  addTreatment(): void {
    if (this.treatmentForm.invalid || !this.details) {
      return;
    }

    this.api
      .createTreatment({
        parcelId: this.details.parcel.id,
        plantingId: null,
        treatmentType: this.treatmentForm.getRawValue().treatmentType,
        appliedAt: this.treatmentForm.getRawValue().appliedAt,
        dose: this.treatmentForm.getRawValue().dose,
        notes: this.treatmentForm.getRawValue().notes || null
      })
      .subscribe(() => {
        this.treatmentForm.reset({
          treatmentType: '',
          appliedAt: '',
          dose: '',
          notes: ''
        });
        this.refresh();
      });
  }
}
