import { z } from 'zod';
import { parcelRepository } from '../repositories/parcel.repository.js';
import { DomainError } from './errors.js';

const parcelSchema = z.object({
  name: z.string().min(2),
  areaHectares: z.number().positive(),
  location: z.string().min(2)
});

export class ParcelService {
  constructor(private readonly repository = parcelRepository) {}

  list() {
    return this.repository.list();
  }

  details(id: number) {
    return this.repository.details(id);
  }

  async create(input: unknown) {
    const data = parcelSchema.parse(input);
    return this.repository.create(data);
  }

  async update(id: number, input: unknown) {
    const data = parcelSchema.parse(input);
    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new DomainError('Parcelle introuvable', 404);
    }
    return updated;
  }

  async remove(id: number) {
    const ok = await this.repository.remove(id);
    if (!ok) {
      throw new DomainError('Parcelle introuvable', 404);
    }
  }
}
