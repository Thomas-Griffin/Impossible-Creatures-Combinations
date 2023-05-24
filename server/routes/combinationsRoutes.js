const express = require('express');
const router = express.Router();
const CombinationService = require('../services/combinationsService');
const combinationsService = new CombinationService();


router.post('/', function (request, response) {
    combinationsService.getCombinations(request.body, parseInt(request.query?.pageNumber) || 1, parseInt(request.query?.nPerPage) || 1).then(combinations => {
            response.json(combinations);
        }
    );
})

router.post('/total', function (request, response) {
    combinationsService.getTotalCombinations(request.body).then(total => {
            response.json(total);
        }
    );
})

router.get('/min-max', function (request, response) {
    combinationsService.getAttributeMinMax(request.query).then(minMax => {
            response.json(minMax[0]);
        }
    );
})

module.exports = router;
