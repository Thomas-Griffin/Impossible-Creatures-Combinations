import {Router} from 'express';
import VisualisationsService from '../services/visualisationsService';
import {cache} from '../app';
import MongoService from '../services/mongoService';

const router = Router();

const visualisationsService = new VisualisationsService(MongoService.getInstance());
router.post('/attribute-chart', async function (request, response) {
    const data = await visualisationsService.getAttributeChart(request.body);
    cache.set(request.originalUrl + request.body, data);
    response.json(data);
});
router.post('/x-per-y-chart', async function (request, response) {
    const data = await visualisationsService.getXPerYChart(request.body);
    cache.set(request.originalUrl + request.body, data);
    response.json(data);
});

export default router;
