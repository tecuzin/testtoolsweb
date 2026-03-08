import { FormBuilder } from '@angular/forms';
import { Injector, runInInjectionContext } from '@angular/core';
import { of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ApiService } from './api.service';
import { ParcelListComponent } from './parcel-list.component';

describe('ParcelListComponent (UI mockee)', () => {
  const apiMock = {
    getParcels: vi.fn(),
    createParcel: vi.fn()
  };

  beforeEach(() => {
    apiMock.getParcels.mockReset();
    apiMock.createParcel.mockReset();
  });

  it('affiche les parcelles recuperees via API mockee', () => {
    apiMock.getParcels.mockReturnValue(
      of([{ id: 1, name: 'Parcelle Nord', areaHectares: 4.2, location: 'Secteur A' }])
    );
    apiMock.createParcel.mockReturnValue(of({ id: 2 }));

    const injector = Injector.create({
      providers: [FormBuilder, { provide: ApiService, useValue: apiMock }]
    });
    const component = runInInjectionContext(injector, () => new ParcelListComponent());
    component.ngOnInit();

    expect(apiMock.getParcels).toHaveBeenCalledOnce();
    expect(component.parcels()).toHaveLength(1);
    expect(component.parcels()[0].name).toBe('Parcelle Nord');
  });

  it('ouvre le formulaire puis cree une parcelle sans appel HTTP reel', () => {
    apiMock.getParcels.mockReturnValue(of([]));
    apiMock.createParcel.mockReturnValue(of({ id: 10 }));

    const injector = Injector.create({
      providers: [FormBuilder, { provide: ApiService, useValue: apiMock }]
    });
    const component = runInInjectionContext(injector, () => new ParcelListComponent());
    component.showCreateForm.set(true);

    component.parcelForm.setValue({
      name: 'Grand Clos',
      areaHectares: 3.1,
      location: 'Plateau'
    });
    component.onSubmit();

    expect(apiMock.createParcel).toHaveBeenCalledWith({
      name: 'Grand Clos',
      areaHectares: 3.1,
      location: 'Plateau'
    });
    expect(component.showCreateForm()).toBe(false);
  });

  it('calcule les indicateurs d avancement de la vue UI', () => {
    const injector = Injector.create({
      providers: [FormBuilder, { provide: ApiService, useValue: apiMock }]
    });
    const component = runInInjectionContext(injector, () => new ParcelListComponent());

    expect(component.completionFromArea(4.2)).toBeGreaterThanOrEqual(20);
    expect(component.statusFromCompletion(85)).toBe('Operation quasi terminee');
    expect(component.statusFromCompletion(60)).toBe('En cours');
    expect(component.statusFromCompletion(30)).toBe('Demarrage');
  });

  it('ignore la soumission si formulaire invalide', () => {
    apiMock.getParcels.mockReturnValue(of([]));
    apiMock.createParcel.mockReturnValue(of({ id: 10 }));

    const injector = Injector.create({
      providers: [FormBuilder, { provide: ApiService, useValue: apiMock }]
    });
    const component = runInInjectionContext(injector, () => new ParcelListComponent());

    component.parcelForm.setValue({
      name: '',
      areaHectares: 0,
      location: ''
    });
    component.onSubmit();

    expect(apiMock.createParcel).not.toHaveBeenCalled();
  });
});
