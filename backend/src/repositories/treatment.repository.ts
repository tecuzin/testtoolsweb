import { pool } from '../db/pool.js';
import type { Treatment } from '../types/domain.js';

function toTreatment(row: Record<string, unknown>): Treatment {
  return {
    id: Number(row.id),
    parcelId: Number(row.parcel_id),
    plantingId: row.planting_id ? Number(row.planting_id) : null,
    treatmentType: String(row.treatment_type),
    appliedAt: String(row.applied_at),
    dose: String(row.dose),
    notes: row.notes ? String(row.notes) : null,
    createdAt: new Date(String(row.created_at)).toISOString()
  };
}

export const treatmentRepository = {
  async listByParcel(parcelId: number): Promise<Treatment[]> {
    const result = await pool.query(
      'SELECT * FROM treatments WHERE parcel_id = $1 ORDER BY id',
      [parcelId]
    );
    return result.rows.map(toTreatment);
  },

  async create(input: {
    parcelId: number;
    plantingId: number | null;
    treatmentType: string;
    appliedAt: string;
    dose: string;
    notes: string | null;
  }): Promise<Treatment> {
    const result = await pool.query(
      `INSERT INTO treatments (parcel_id, planting_id, treatment_type, applied_at, dose, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        input.parcelId,
        input.plantingId,
        input.treatmentType,
        input.appliedAt,
        input.dose,
        input.notes
      ]
    );
    return toTreatment(result.rows[0]);
  },

  async remove(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM treatments WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};
