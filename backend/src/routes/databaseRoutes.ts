import {Router} from 'express';
import DatabaseService from '../services/databaseService';

const router = Router();

const databaseService = new DatabaseService();

router.get('/reset', async function (_request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    await databaseService.resetDatabase().then(result => {
        response.json(result);
    });
});

export default router;
