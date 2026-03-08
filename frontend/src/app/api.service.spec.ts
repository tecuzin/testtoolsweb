import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService (mocked HTTP)', () => {
  it('lists parcels through mocked HttpClient', async () => {
    const httpMock = {
      get: vi.fn().mockReturnValue(
        of([
          {
            id: 1,
            name: 'Parcelle Nord',
            areaHectares: 4.2,
            location: 'Secteur A',
            createdAt: new Date().toISOString()
          }
        ])
      ),
      post: vi.fn()
    };

    const service = new ApiService(httpMock as any);

    const items = await service.listParcels().toPromise();
    expect(httpMock.get).toHaveBeenCalledOnce();
    expect(items?.[0].name).toBe('Parcelle Nord');
  });

  it('creates a planting through mocked HttpClient', async () => {
    const httpMock = {
      get: vi.fn(),
      post: vi.fn().mockReturnValue(of({ id: 10, cropType: 'Mais' }))
    };

    const service = new ApiService(httpMock as any);

    const result = await service
      .createPlanting({
        parcelId: 1,
        cropType: 'Mais',
        plantedAt: '2026-03-05',
        areaHectares: 1.5
      })
      .toPromise();

    expect(httpMock.post).toHaveBeenCalledOnce();
    expect(result?.cropType).toBe('Mais');
  });
});
