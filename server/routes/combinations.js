const express = require('express');
const router = express.Router();
const CombinationService = require('../services/combinationsService');
const combinationsService = new CombinationService();

router.get('/', function (request, response) {
    combinationsService.getCombinations(parseInt(request.query?.pageNumber) || 0, parseInt(request.query?.nPerPage) || 0).then(combinations => {
            response.json(combinations);
        }
    );
});

router.post('/set-mod', function (request, response) {
    response.json(combinationsService.setMod(request.body));
})

router.post('/filter', function (request, response) {
    combinationsService.getCombinationsInRange(request.body.attribute, request.body.min, request.body.max, parseInt(request.query?.pageNumber) || 0, parseInt(request.query?.nPerPage) || 0).then(combinations => {
            response.json(combinations);
        }
    );
})

router.post('/filters', function (request, response) {
    combinationsService.getCombinationsInRangeMultipleAttributes(request.body.attributes, parseInt(request.query?.pageNumber) || 0, parseInt(request.query?.nPerPage) || 0).then(combinations => {
            response.json(combinations);
        }
    );
})

router.get('/total', function (request, response) {
    combinationsService.getTotalCombinations().then(total => {
            response.json(total);
        }
    );
})


router.get('/min-max', function (request, response) {
    combinationsService.getAttributeMinMax(request.query?.attribute).then(minMax => {
            response.json(minMax);
        }
    );
})

module.exports = router;
