import { pool } from '../db/pool.js';
import type { Planting } from '../types/domain.js';

function toPlanting(row: Record<string, unknown>): Planting {
  return {
    id: Number(row.id),
    parcelId: Number(row.parcel_id),
    cropType: String(row.crop_type),
    plantedAt: String(row.planted_at),
    areaHectares: Number(row.area_hectares),
    createdAt: new Date(String(row.created_at)).toISOString()
  };
}

export const plantingRepository = {
  async listByParcel(parcelId: number): Promise<Planting[]> {
    const result = await pool.query(
      'SELECT * FROM plantings WHERE parcel_id = $1 ORDER BY id',
      [parcelId]
    );
    return result.rows.map(toPlanting);
  },

  async create(input: {
    parcelId: number;
    cropType: string;
    plantedAt: string;
    areaHectares: number;
  }): Promise<Planting> {
    const result = await pool.query(
      `INSERT INTO plantings (parcel_id, crop_type, planted_at, area_hectares)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [input.parcelId, input.cropType, input.plantedAt, input.areaHectares]
    );
    return toPlanting(result.rows[0]);
  },

  async remove(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM plantings WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
};
