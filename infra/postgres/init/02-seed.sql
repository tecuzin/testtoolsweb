TRUNCATE TABLE treatments, plantings, parcels RESTART IDENTITY CASCADE;

INSERT INTO parcels (name, area_hectares, location)
VALUES
  ('Parcelle Nord', 4.20, 'Secteur A'),
  ('Parcelle Sud', 6.80, 'Secteur B');

INSERT INTO plantings (parcel_id, crop_type, planted_at, area_hectares)
VALUES
  (1, 'Ble tendre', '2026-02-10', 3.00),
  (1, 'Mais grain', '2026-02-20', 1.20),
  (2, 'Colza', '2026-02-15', 5.50);

INSERT INTO treatments (parcel_id, planting_id, treatment_type, applied_at, dose, notes)
VALUES
  (1, 1, 'Fongicide', '2026-03-01', '0.8 L/ha', 'Passage matin'),
  (2, 3, 'Herbicide', '2026-03-03', '1.2 L/ha', 'Vent faible');
