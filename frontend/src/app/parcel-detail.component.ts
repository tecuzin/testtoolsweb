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
      <h2 data-testid="parcel-title">{{ details.parcel.name }}</h2>
      <p>Surface: {{ details.parcel.areaHectares }} ha</p>
      <p>Localisation: {{ details.parcel.location }}</p>
      <a routerLink="/">Retour</a>
    </section>

    <section class="grid-2" *ngIf="details">
      <article class="card">
        <h3>Ajouter une plantation</h3>
        <form [formGroup]="plantingForm" (ngSubmit)="addPlanting()" data-testid="planting-create-form">
          <label for="crop">Culture</label>
          <input id="crop" formControlName="cropType" data-testid="planting-crop-input" />

          <label for="plantedAt">Date de semis</label>
          <input id="plantedAt" type="date" formControlName="plantedAt" data-testid="planting-date-input" />

          <label for="plantingArea">Surface (ha)</label>
          <input id="plantingArea" type="number" formControlName="areaHectares" data-testid="planting-area-input" />

          <button type="submit" [disabled]="plantingForm.invalid" data-testid="planting-submit-btn">Ajouter</button>
        </form>

        <ul>
          <li *ngFor="let planting of details.plantings" data-testid="planting-item">
            {{ planting.cropType }} - {{ planting.areaHectares }} ha
          </li>
        </ul>
      </article>

      <article class="card">
        <h3>Ajouter un traitement</h3>
        <form [formGroup]="treatmentForm" (ngSubmit)="addTreatment()" data-testid="treatment-create-form">
          <label for="type">Type</label>
          <input id="type" formControlName="treatmentType" data-testid="treatment-type-input" />

          <label for="appliedAt">Date</label>
          <input id="appliedAt" type="date" formControlName="appliedAt" data-testid="treatment-date-input" />

          <label for="dose">Dose</label>
          <input id="dose" formControlName="dose" data-testid="treatment-dose-input" />

          <label for="notes">Notes</label>
          <input id="notes" formControlName="notes" data-testid="treatment-notes-input" />

          <button type="submit" [disabled]="treatmentForm.invalid" data-testid="treatment-submit-btn">Ajouter</button>
        </form>

        <ul>
          <li *ngFor="let treatment of details.treatments" data-testid="treatment-item">
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
