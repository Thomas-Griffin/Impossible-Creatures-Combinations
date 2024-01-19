import {Router} from 'express';
import DatabaseInitializer from '../services/databaseService';

const router = Router();

const databaseInitializerService = new DatabaseInitializer();

router.get('/reset', async function (_request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    await databaseInitializerService.resetDatabase().then(result => {
        response.json(result);
    });
});

export default router;
