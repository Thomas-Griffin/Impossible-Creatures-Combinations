import { Router } from 'express'
import CombinationService from '../services/combinationsService'

const router = Router()

const combinationsService = new CombinationService()

router.post('/', function (request, response) {
  combinationsService
    .getCombinations(
      request.body,
      parseInt(request.query['pageNumber'] as string) || 1,
      parseInt(request.query['nPerPage'] as string) || 1
    )
    .then(combinations => {
      response.json(combinations)
    })
})

router.post('/total', function (request, response) {
  combinationsService.getTotalCombinations(request.body).then(total => {
    response.json(total)
  })
})

router.post('/min-max', function (request, response) {
  combinationsService.getAttributeMinMax(request.body).then(minMax => {
    response.json(minMax)
  })
})

router.post('/abilities', function (request, response) {
  combinationsService.getAbilities(request.body).then(abilities => {
    response.json(abilities)
  })
})

export default router
