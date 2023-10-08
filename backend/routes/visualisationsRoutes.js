const express = require('express');
const router = express.Router();
const VisualisationsService = require('../services/visualisationsService');
const visualisationsService = new VisualisationsService();

router.post('/research-levels-per-stock', function (request, response) {
    visualisationsService.getResearchLevelsPerStock(request.body).then(result => {
        response.json(result);
    });
})

router.post('/coal-distribution', function (request, response) {
    visualisationsService.getCoalCostDistribution(request.body).then(result => {
        response.json(result);
    });
})

router.post('/coal-distribution-per-research-level', function (request, response) {
    visualisationsService.getCoalCostDistributionPerResearchLevel(request.body).then(result => {
        response.json(result);
    });
})

router.post('/electricity-distribution', function (request, response) {
    visualisationsService.getElectricityDistribution(request.body).then(result => {
        response.json(result);
    });
})

router.post('/electricity-distribution-per-research-level', function (request, response) {
    visualisationsService.getElectricityDistributionPerResearchLevel(request.body).then(result => {
        response.json(result);
    });
})

module.exports = router;