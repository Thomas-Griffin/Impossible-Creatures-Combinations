import ModService from '../services/modService';
import {Router} from 'express';
import {cache} from '../../app';

const router = Router();
const modService = new ModService();

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
