import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcel, ParcelDetails, Planting, Treatment } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl =
    import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  listParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.baseUrl}/parcels`);
  }

  getParcelDetails(id: number): Observable<ParcelDetails> {
    return this.http.get<ParcelDetails>(`${this.baseUrl}/parcels/${id}`);
  }

  createParcel(payload: {
    name: string;
    areaHectares: number;
    location: string;
  }): Observable<Parcel> {
    return this.http.post<Parcel>(`${this.baseUrl}/parcels`, payload);
  }

  createPlanting(payload: {
    parcelId: number;
    cropType: string;
    plantedAt: string;
    areaHectares: number;
  }): Observable<Planting> {
    return this.http.post<Planting>(`${this.baseUrl}/plantings`, payload);
  }

  createTreatment(payload: {
    parcelId: number;
    plantingId: number | null;
    treatmentType: string;
    appliedAt: string;
    dose: string;
    notes: string | null;
  }): Observable<Treatment> {
    return this.http.post<Treatment>(`${this.baseUrl}/treatments`, payload);
  }
}
