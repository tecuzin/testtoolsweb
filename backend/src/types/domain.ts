export interface Parcel {
  id: number;
  name: string;
  areaHectares: number;
  location: string;
  createdAt: string;
}

export interface Planting {
  id: number;
  parcelId: number;
  cropType: string;
  plantedAt: string;
  areaHectares: number;
  createdAt: string;
}

export interface Treatment {
  id: number;
  parcelId: number;
  plantingId: number | null;
  treatmentType: string;
  appliedAt: string;
  dose: string;
  notes: string | null;
  createdAt: string;
}

export interface ParcelDetails {
  parcel: Parcel;
  plantings: Planting[];
  treatments: Treatment[];
}
