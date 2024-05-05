import {Router} from 'express';
import CombinationService from '../services/combinationsService';
import cache from '../app';
import MongoService from '../services/mongoService';

const router = Router();

const combinationsService = new CombinationService(MongoService.getInstance());

router.post('/', async function (request, response) {
    const data = await combinationsService.getCombinations(request.body);
    cache.set(request.originalUrl + request.body, data);
    response.json(data);
});

router.post('/total', async function (request, response) {
    const data = await combinationsService.getTotalCombinations(request.body);
    cache.set(request.originalUrl + request.body, data);
    response.json(data);
});

router.post('/min-max', async function (request, response) {
    const data = await combinationsService.getAttributeMinMax(request.body);
    cache.set(request.originalUrl + request.body, data);
    response.json(data);
});

router.post('/abilities', async function (request, response) {
    const data = await combinationsService.getAbilities(request.body);
    cache.set(request.originalUrl + request.body, data);
    response.json(data);
});

export default router;
