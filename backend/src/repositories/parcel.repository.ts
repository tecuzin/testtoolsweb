import { pool } from '../db/pool.js';
import type { Parcel, ParcelDetails } from '../types/domain.js';

function toParcel(row: Record<string, unknown>): Parcel {
  return {
    id: Number(row.id),
    name: String(row.name),
    areaHectares: Number(row.area_hectares),
    location: String(row.location),
    createdAt: new Date(String(row.created_at)).toISOString()
  };
}

export const parcelRepository = {
  async list(): Promise<Parcel[]> {
    const result = await pool.query('SELECT * FROM parcels ORDER BY id');
    return result.rows.map(toParcel);
  },

  async getById(id: number): Promise<Parcel | null> {
    const result = await pool.query('SELECT * FROM parcels WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return null;
    }
    return toParcel(result.rows[0]);
  },

  async create(input: {
    name: string;
    areaHectares: number;
    location: string;
  }): Promise<Parcel> {
    const result = await pool.query(
      `INSERT INTO parcels (name, area_hectares, location)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [input.name, input.areaHectares, input.location]
    );
    return toParcel(result.rows[0]);
  },

  async update(
    id: number,
    input: { name: string; areaHectares: number; location: string }
  ): Promise<Parcel | null> {
    const result = await pool.query(
      `UPDATE parcels
       SET name = $1,
           area_hectares = $2,
           location = $3
       WHERE id = $4
       RETURNING *`,
      [input.name, input.areaHectares, input.location, id]
    );
    if (result.rowCount === 0) {
      return null;
    }
    return toParcel(result.rows[0]);
  },

  async remove(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM parcels WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async details(id: number): Promise<ParcelDetails | null> {
    const parcel = await this.getById(id);
    if (!parcel) {
      return null;
    }

    const plantingsResult = await pool.query(
      'SELECT * FROM plantings WHERE parcel_id = $1 ORDER BY id',
      [id]
    );
    const treatmentsResult = await pool.query(
      'SELECT * FROM treatments WHERE parcel_id = $1 ORDER BY id',
      [id]
    );

    return {
      parcel,
      plantings: plantingsResult.rows.map((row: Record<string, unknown>) => ({
        id: Number(row.id),
        parcelId: Number(row.parcel_id),
        cropType: String(row.crop_type),
        plantedAt: String(row.planted_at),
        areaHectares: Number(row.area_hectares),
        createdAt: new Date(String(row.created_at)).toISOString()
      })),
      treatments: treatmentsResult.rows.map((row: Record<string, unknown>) => ({
        id: Number(row.id),
        parcelId: Number(row.parcel_id),
        plantingId: row.planting_id ? Number(row.planting_id) : null,
        treatmentType: String(row.treatment_type),
        appliedAt: String(row.applied_at),
        dose: String(row.dose),
        notes: row.notes ? String(row.notes) : null,
        createdAt: new Date(String(row.created_at)).toISOString()
      }))
    };
  }
};
