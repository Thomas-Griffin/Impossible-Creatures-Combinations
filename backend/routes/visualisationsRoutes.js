const express = require('express');
const router = express.Router();
const VisualisationsService = require('../services/visualisationsService');
const visualisationsService = new VisualisationsService();


router.post('/research-levels-per-stock', function (request, response) {
    visualisationsService.getResearchLevelsPerStock(request.body).then(combinations => {
        response.json(combinations);
    });
})


router.post('/coal-cost-per-stock', function (request, response) {
    visualisationsService.getCoalCostPerStock(request.body).then(combinations => {
        response.json(combinations);
    });
})


module.exports = router;