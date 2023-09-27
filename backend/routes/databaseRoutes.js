const express = require('express');
const router = express.Router();
const DatabaseInitializer = require('../services/databaseService');
const databaseInitializerService = new DatabaseInitializer();

router.get('/reset', async function (request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    await databaseInitializerService.resetDatabase().then(result => {
            response.json(result);
        }
    );
});


module.exports = router;

