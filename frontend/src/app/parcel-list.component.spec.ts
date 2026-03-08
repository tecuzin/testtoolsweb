import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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
    TestBed.resetTestingModule();
  });

  it('affiche les parcelles recuperees via API mockee', () => {
    apiMock.getParcels.mockReturnValue(
      of([{ id: 1, name: 'Parcelle Nord', areaHectares: 4.2, location: 'Secteur A' }])
    );
    apiMock.createParcel.mockReturnValue(
      of({ id: 2, name: 'Parcelle Sud', areaHectares: 2.5, location: 'Secteur B' })
    );

    TestBed.configureTestingModule({
      imports: [ParcelListComponent],
      providers: [{ provide: ApiService, useValue: apiMock }, provideRouter([])]
    });

    const fixture = TestBed.createComponent(ParcelListComponent);
    fixture.detectChanges();

    expect(apiMock.getParcels).toHaveBeenCalledOnce();
    const cards = fixture.nativeElement.querySelectorAll('[data-testid="parcel-item"]');
    expect(cards.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Parcelle Nord');
  });

  it('ouvre le formulaire puis cree une parcelle sans appel HTTP reel', () => {
    apiMock.getParcels.mockReturnValue(of([]));
    apiMock.createParcel.mockReturnValue(
      of({ id: 10, name: 'Grand Clos', areaHectares: 3.1, location: 'Plateau' })
    );

    TestBed.configureTestingModule({
      imports: [ParcelListComponent],
      providers: [{ provide: ApiService, useValue: apiMock }, provideRouter([])]
    });

    const fixture = TestBed.createComponent(ParcelListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const toggleButton = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    ).find((button: HTMLButtonElement) => button.textContent?.includes('Nouvelle parcelle'));
    toggleButton?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="parcel-create-form"]')).not.toBeNull();

    component.parcelForm.setValue({
      name: 'Grand Clos',
      areaHectares: 3.1,
      location: 'Plateau'
    });
    component.onSubmit();
    fixture.detectChanges();

    expect(apiMock.createParcel).toHaveBeenCalledWith({
      name: 'Grand Clos',
      areaHectares: 3.1,
      location: 'Plateau'
    });
    expect(component.showCreateForm()).toBe(false);
  });
});
