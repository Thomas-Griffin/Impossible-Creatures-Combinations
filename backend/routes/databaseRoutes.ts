import {Router} from 'express';
import DatabaseService from '../services/databaseService';
import MongoService from '../services/mongoService';

const router = Router();

const databaseService = new DatabaseService(MongoService.getInstance());

router.get('/reset', async function (_request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    await databaseService.resetDatabase().then(result => {
        response.json(result);
    });
});

export default router;
