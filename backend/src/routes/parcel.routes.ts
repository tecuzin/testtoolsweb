import { Router } from 'express';
import { ParcelService } from '../services/parcel.service.js';

const router = Router();
const service = new ParcelService();

router.get('/', async (_req, res, next) => {
  try {
    const parcels = await service.list();
    res.json(parcels);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const details = await service.details(Number(req.params.id));
    if (!details) {
      res.status(404).json({ message: 'Parcelle introuvable' });
      return;
    }
    res.json(details);
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

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await service.update(Number(req.params.id), req.body);
    res.json(updated);
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
