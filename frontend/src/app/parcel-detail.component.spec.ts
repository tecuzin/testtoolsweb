import { FormBuilder } from '@angular/forms';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from './api.service';
import { ParcelDetailComponent } from './parcel-detail.component';

describe('ParcelDetailComponent (UI mockee)', () => {
  const apiMock = {
    getParcel: vi.fn(),
    createPlanting: vi.fn(),
    createTreatment: vi.fn()
  };

  const detailsFixture = {
    parcel: { id: 1, name: 'Parcelle Est', areaHectares: 5.5, location: 'Zone C' },
    plantings: [{ id: 11, parcelId: 1, cropType: 'Ble', plantedAt: '2026-03-01', areaHectares: 2.0 }],
    treatments: [{ id: 22, parcelId: 1, plantingId: 11, treatmentType: 'Fongicide', appliedAt: '2026-03-02', dose: '2L/ha', notes: null }]
  };

  beforeEach(() => {
    apiMock.getParcel.mockReset();
    apiMock.createPlanting.mockReset();
    apiMock.createTreatment.mockReset();
  });

  it('affiche les details de parcelle avec donnees API mockees', () => {
    apiMock.getParcel.mockReturnValue(of(detailsFixture));
    apiMock.createPlanting.mockReturnValue(of(detailsFixture.plantings[0]));
    apiMock.createTreatment.mockReturnValue(of(detailsFixture.treatments[0]));

    const injector = createEnvironmentInjector([
      FormBuilder,
      { provide: ApiService, useValue: apiMock },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => '1' } } }
      }
    ]);

    const component = runInInjectionContext(injector, () => new ParcelDetailComponent());
    component.ngOnInit();

    expect(apiMock.getParcel).toHaveBeenCalledWith(1);
    expect(component.details()?.parcel.name).toBe('Parcelle Est');
    expect(component.details()?.plantings).toHaveLength(1);
    expect(component.details()?.treatments).toHaveLength(1);
    expect(component.plantingForm.getRawValue().areaHectares).toBe(5.5);
    injector.destroy();
  });

  it('soumet un traitement avec plantingId derive des details', () => {
    apiMock.getParcel.mockReturnValue(of(detailsFixture));
    apiMock.createPlanting.mockReturnValue(of(detailsFixture.plantings[0]));
    apiMock.createTreatment.mockReturnValue(of(detailsFixture.treatments[0]));

    const injector = createEnvironmentInjector([
      FormBuilder,
      { provide: ApiService, useValue: apiMock },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => '1' } } }
      }
    ]);

    const component = runInInjectionContext(injector, () => new ParcelDetailComponent());
    component.ngOnInit();

    component.openForm('treatment');
    component.treatmentForm.setValue({
      treatmentType: 'Herbicide',
      appliedAt: '2026-03-10',
      dose: '1.5L/ha',
      notes: ''
    });
    component.submitTreatment();

    expect(apiMock.createTreatment).toHaveBeenCalledWith({
      parcelId: 1,
      plantingId: 11,
      treatmentType: 'Herbicide',
      appliedAt: '2026-03-10',
      dose: '1.5L/ha',
      notes: null
    });
    injector.destroy();
  });

  it('soumet une plantation avec parcelId courant', () => {
    apiMock.getParcel.mockReturnValue(of(detailsFixture));
    apiMock.createPlanting.mockReturnValue(of(detailsFixture.plantings[0]));
    apiMock.createTreatment.mockReturnValue(of(detailsFixture.treatments[0]));

    const injector = createEnvironmentInjector([
      FormBuilder,
      { provide: ApiService, useValue: apiMock },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => '1' } } }
      }
    ]);

    const component = runInInjectionContext(injector, () => new ParcelDetailComponent());
    component.ngOnInit();
    component.openForm('planting');
    component.plantingForm.setValue({
      cropType: 'Mais',
      plantedAt: '2026-03-12',
      areaHectares: 1.2
    });
    component.submitPlanting();

    expect(apiMock.createPlanting).toHaveBeenCalledWith({
      parcelId: 1,
      cropType: 'Mais',
      plantedAt: '2026-03-12',
      areaHectares: 1.2
    });
    expect(component.activeForm()).toBe(null);
    injector.destroy();
  });
});
