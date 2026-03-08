import { TreatmentService } from '../src/services/treatment.service';

describe('TreatmentService', () => {
  it('rejects treatment creation when parcel does not exist', async () => {
    const treatmentRepo = {
      listByParcel: jest.fn(),
      create: jest.fn(),
      remove: jest.fn()
    };

    const parcelRepo = {
      getById: jest.fn().mockResolvedValue(null)
    };

    const service = new TreatmentService(treatmentRepo as any, parcelRepo as any);

    await expect(
      service.create({
        parcelId: 99,
        plantingId: null,
        treatmentType: 'Fongicide',
        appliedAt: '2026-03-06',
        dose: '1.8L/ha',
        notes: null
      })
    ).rejects.toMatchObject({
      status: 404,
      message: 'Parcelle inexistante'
    });
    expect(treatmentRepo.create).not.toHaveBeenCalled();
  });

  it('creates treatment when parcel exists', async () => {
    const treatmentRepo = {
      listByParcel: jest.fn(),
      create: jest.fn().mockResolvedValue({ id: 5, treatmentType: 'Herbicide' }),
      remove: jest.fn()
    };

    const parcelRepo = {
      getById: jest.fn().mockResolvedValue({ id: 1 })
    };

    const service = new TreatmentService(treatmentRepo as any, parcelRepo as any);
    const result = await service.create({
      parcelId: 1,
      plantingId: 10,
      treatmentType: 'Herbicide',
      appliedAt: '2026-03-05',
      dose: '2L/ha',
      notes: 'test'
    });

    expect(treatmentRepo.create).toHaveBeenCalledWith({
      parcelId: 1,
      plantingId: 10,
      treatmentType: 'Herbicide',
      appliedAt: '2026-03-05',
      dose: '2L/ha',
      notes: 'test'
    });
    expect(result).toEqual({ id: 5, treatmentType: 'Herbicide' });
  });

  it('throws when removing unknown treatment', async () => {
    const treatmentRepo = {
      listByParcel: jest.fn(),
      create: jest.fn(),
      remove: jest.fn().mockResolvedValue(false)
    };
    const parcelRepo = {
      getById: jest.fn()
    };

    const service = new TreatmentService(treatmentRepo as any, parcelRepo as any);
    await expect(service.remove(404)).rejects.toMatchObject({
      status: 404,
      message: 'Traitement introuvable'
    });
  });
});
