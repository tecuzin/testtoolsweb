import { Router } from 'express';
import { PlantingService } from '../services/planting.service.js';

const router = Router();
const service = new PlantingService();

router.get('/parcel/:parcelId', async (req, res, next) => {
  try {
    const items = await service.listByParcel(Number(req.params.parcelId));
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await service.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await service.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
