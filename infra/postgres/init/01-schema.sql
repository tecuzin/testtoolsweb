CREATE TABLE IF NOT EXISTS parcels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  area_hectares NUMERIC(10,2) NOT NULL CHECK (area_hectares > 0),
  location TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plantings (
  id SERIAL PRIMARY KEY,
  parcel_id INTEGER NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  planted_at DATE NOT NULL,
  area_hectares NUMERIC(10,2) NOT NULL CHECK (area_hectares > 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatments (
  id SERIAL PRIMARY KEY,
  parcel_id INTEGER NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  planting_id INTEGER REFERENCES plantings(id) ON DELETE SET NULL,
  treatment_type TEXT NOT NULL,
  applied_at DATE NOT NULL,
  dose TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
