const express = require('express');
const router = express.Router();
const CombinationService = require('../services/combinationsService');
const combinationsService = new CombinationService();

router.get('/', async function (request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    await combinationsService.getCombinations(parseInt(request.query?.pageNumber), parseInt(request.query?.nPerPage)).then(combinations => {
            response.json(combinations);
        }
    );
});

router.post('/set-mod', function (request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    response.json(combinationsService.setMod(request.body));
})

router.post('/filter', function (request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    combinationsService.getCombinationsInRange(request.body.attribute, request.body.min, request.body.max, parseInt(request.query?.pageNumber) || 1, parseInt(request.query?.nPerPage) || 1).then(combinations => {
            response.json(combinations);
        }
    );
})

router.post('/filters', function (request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    combinationsService.getCombinationsWithFiltersAndSorting(request.body, parseInt(request.query?.pageNumber) || 1, parseInt(request.query?.nPerPage) || 1).then(combinations => {
            response.json(combinations);
        }
    );
})

router.get('/total', function (request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    combinationsService.getTotalCombinations().then(total => {
            response.json(total);
        }
    );
})

router.post('/total', function (request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    combinationsService.getTotalCombinationsWithFilters(request.body).then(total => {
            response.json(total);
        }
    );
})


router.get('/min-max', function (request, response) {
    response.setHeader('Cache-Control', 'no-cache');
    combinationsService.getAttributeMinMax(request.query?.attribute).then(minMax => {
            response.json(minMax[0]);
        }
    );
})

module.exports = router;
