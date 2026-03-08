import { z } from 'zod';
import { parcelRepository } from '../repositories/parcel.repository.js';
import { plantingRepository } from '../repositories/planting.repository.js';
import { DomainError } from './errors.js';

const plantingSchema = z.object({
  parcelId: z.number().int().positive(),
  cropType: z.string().min(2),
  plantedAt: z.string().min(8),
  areaHectares: z.number().positive()
});

export class PlantingService {
  constructor(
    private readonly repository = plantingRepository,
    private readonly parcels = parcelRepository
  ) {}

  async listByParcel(parcelId: number) {
    return this.repository.listByParcel(parcelId);
  }

  async create(input: unknown) {
    const data = plantingSchema.parse(input);
    const parcel = await this.parcels.getById(data.parcelId);
    if (!parcel) {
      throw new DomainError('Parcelle inexistante', 404);
    }
    return this.repository.create(data);
  }

  async remove(id: number) {
    const ok = await this.repository.remove(id);
    if (!ok) {
      throw new DomainError('Plantation introuvable', 404);
    }
  }
}
