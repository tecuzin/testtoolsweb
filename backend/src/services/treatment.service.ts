import { z } from 'zod';
import { parcelRepository } from '../repositories/parcel.repository.js';
import { treatmentRepository } from '../repositories/treatment.repository.js';
import { DomainError } from './errors.js';

const treatmentSchema = z.object({
  parcelId: z.number().int().positive(),
  plantingId: z.number().int().positive().nullable(),
  treatmentType: z.string().min(2),
  appliedAt: z.string().min(8),
  dose: z.string().min(2),
  notes: z.string().nullable()
});

export class TreatmentService {
  constructor(
    private readonly repository = treatmentRepository,
    private readonly parcels = parcelRepository
  ) {}

  async listByParcel(parcelId: number) {
    return this.repository.listByParcel(parcelId);
  }

  async create(input: unknown) {
    const data = treatmentSchema.parse(input);
    const parcel = await this.parcels.getById(data.parcelId);
    if (!parcel) {
      throw new DomainError('Parcelle inexistante', 404);
    }
    return this.repository.create(data);
  }

  async remove(id: number) {
    const ok = await this.repository.remove(id);
    if (!ok) {
      throw new DomainError('Traitement introuvable', 404);
    }
  }
}
