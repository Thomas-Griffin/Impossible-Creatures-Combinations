import ModService from '../services/modService';
import {Router} from 'express';
import {cache} from '../app';
import MongoService from '../services/mongoService';

const router = Router();
const modService = new ModService(MongoService.getInstance());

router.get('/', async function (request, response) {
    const data = await modService.getMods();
    cache.set(request.originalUrl, data);
    response.json(data);
});

router.get('/name/:name', async function (request, response) {
    const data = await modService.getModsByName(request.params.name);
    cache.set(request.originalUrl, data);
    response.json(data);
});

export default router;
