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
    <div class="container-fluid px-3 px-lg-4 py-4">
      <section class="board-frame">
        <aside class="board-sidebar">
          <p class="board-label">Filtre</p>
          <nav class="nav flex-column gap-1 mb-4">
            <a class="nav-link active">Toutes</a>
            <a class="nav-link">Priorite haute</a>
            <a class="nav-link">A surveiller</a>
            <a class="nav-link">Completes</a>
          </nav>
          <button
            type="button"
            (click)="showCreateForm.set(!showCreateForm())"
            class="btn btn-success w-100"
          >
            Nouvelle parcelle
          </button>
        </aside>

        <section class="board-content">
          <header class="board-toolbar">
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-sm btn-outline-success">Vue</button>
              <button class="btn btn-sm btn-outline-success">Grille</button>
            </div>
            <input class="form-control form-control-sm board-search" placeholder="Rechercher une parcelle..." />
          </header>

          <section class="card border-0 shadow-sm mb-3" *ngIf="showCreateForm()">
            <div class="card-body p-4">
              <h2 class="h5 mb-3 text-success-emphasis">Nouvelle parcelle</h2>
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
                  <div class="col-12 d-flex justify-content-end gap-2 pt-1">
                    <button type="button" (click)="showCreateForm.set(false)" class="btn btn-outline-secondary">Annuler</button>
                    <button [disabled]="parcelForm.invalid" type="submit" data-testid="parcel-submit-btn" class="btn btn-success">
                      Enregistrer
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h4 mb-0 text-success-emphasis">Pilotage des parcelles</h1>
            <span class="badge text-bg-success-subtle border">{{ parcels().length }} parcelles</span>
          </div>

          <div class="row g-3" *ngIf="parcels().length > 0">
            <div class="col-12 col-md-6 col-xl-4" *ngFor="let p of parcels(); trackBy: trackByParcelId">
              <article class="card task-card border-success-subtle" data-testid="parcel-item">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <a [routerLink]="['/parcels', p.id]" class="fw-semibold text-decoration-none text-dark">
                      {{ p.name }}
                    </a>
                    <span class="badge text-bg-success-subtle border">Priorite haute</span>
                  </div>

                  <div class="small text-secondary mb-1">Localisation: {{ p.location }}</div>
                  <div class="small text-secondary mb-2">Surface: {{ p.areaHectares }} ha</div>

                  <div class="display-6 fw-bold text-success mb-1">{{ completionFromArea(p.areaHectares) }}%</div>
                  <div class="progress mb-3" role="progressbar" aria-label="Progression parcelle">
                    <div
                      class="progress-bar bg-success"
                      [style.width.%]="completionFromArea(p.areaHectares)"
                    ></div>
                  </div>

                  <div class="small text-secondary mb-3">
                    Statut de suivi: {{ statusFromCompletion(completionFromArea(p.areaHectares)) }}
                  </div>

                  <div class="d-flex justify-content-end">
                    <a [routerLink]="['/parcels', p.id]" class="btn btn-sm btn-outline-success">Ouvrir</a>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div class="card border-0 shadow-sm" *ngIf="parcels().length === 0">
            <div class="card-body py-5 text-center text-secondary">
              <h3 class="h5 mb-0">Aucune parcelle trouvee</h3>
            </div>
          </div>
        </section>
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

  completionFromArea(area: number): number {
    const value = Math.round((area * 14) % 101);
    return Math.max(20, value);
  }

  statusFromCompletion(value: number): string {
    if (value >= 80) {
      return 'Operation quasi terminee';
    }
    if (value >= 50) {
      return 'En cours';
    }
    return 'Demarrage';
  }
}
