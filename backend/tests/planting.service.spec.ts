import { PlantingService } from '../src/services/planting.service';

describe('PlantingService', () => {
  it('rejects planting creation when parcel does not exist', async () => {
    const plantingRepo = {
      listByParcel: jest.fn(),
      create: jest.fn(),
      remove: jest.fn()
    };

    const parcelRepo = {
      getById: jest.fn().mockResolvedValue(null)
    };

    const service = new PlantingService(plantingRepo as any, parcelRepo as any);

    await expect(
      service.create({
        parcelId: 44,
        cropType: 'Ble',
        plantedAt: '2026-03-04',
        areaHectares: 2.1
      })
    ).rejects.toMatchObject({
      status: 404,
      message: 'Parcelle inexistante'
    });
    expect(plantingRepo.create).not.toHaveBeenCalled();
  });

  it('creates planting when parcel exists', async () => {
    const plantingRepo = {
      listByParcel: jest.fn(),
      create: jest.fn().mockResolvedValue({ id: 7, parcelId: 1, cropType: 'Mais' }),
      remove: jest.fn()
    };

    const parcelRepo = {
      getById: jest.fn().mockResolvedValue({ id: 1 })
    };

    const service = new PlantingService(plantingRepo as any, parcelRepo as any);
    const result = await service.create({
      parcelId: 1,
      cropType: 'Mais',
      plantedAt: '2026-03-05',
      areaHectares: 1.8
    });

    expect(plantingRepo.create).toHaveBeenCalledWith({
      parcelId: 1,
      cropType: 'Mais',
      plantedAt: '2026-03-05',
      areaHectares: 1.8
    });
    expect(result).toEqual({ id: 7, parcelId: 1, cropType: 'Mais' });
  });
});
