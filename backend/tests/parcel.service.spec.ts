import { ParcelService } from '../src/services/parcel.service';
import { DomainError } from '../src/services/errors';

describe('ParcelService', () => {
  it('creates a parcel with valid payload', async () => {
    const repo = {
      list: jest.fn(),
      details: jest.fn(),
      create: jest.fn().mockResolvedValue({ id: 1, name: 'Parcelle Est' }),
      update: jest.fn(),
      remove: jest.fn()
    };

    const service = new ParcelService(repo as any);
    const result = await service.create({
      name: 'Parcelle Est',
      areaHectares: 2.5,
      location: 'Secteur C'
    });

    expect(repo.create).toHaveBeenCalledWith({
      name: 'Parcelle Est',
      areaHectares: 2.5,
      location: 'Secteur C'
    });
    expect(result).toEqual({ id: 1, name: 'Parcelle Est' });
  });

  it('throws 404 when updating unknown parcel', async () => {
    const repo = {
      list: jest.fn(),
      details: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue(null),
      remove: jest.fn()
    };

    const service = new ParcelService(repo as any);

    await expect(
      service.update(999, {
        name: 'Parcelle X',
        areaHectares: 1,
        location: 'Zone Y'
      })
    ).rejects.toMatchObject<Partial<DomainError>>({
      status: 404,
      message: 'Parcelle introuvable'
    });
  });
});
