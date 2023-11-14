import { Router } from 'express'
import VisualisationsService from '../services/visualisationsService'

const router = Router()

const visualisationsService = new VisualisationsService()

router.post('/research-levels-per-stock', function (request, response) {
  visualisationsService.getResearchLevelsPerStock(request.body).then(result => {
    response.json(result)
  })
})

router.post('/coal-distribution', function (request, response) {
  visualisationsService.getCoalCostDistribution(request.body).then(result => {
    response.json(result)
  })
})

router.post('/coal-distribution-per-research-level', function (request, response) {
  visualisationsService.getCoalCostDistributionPerResearchLevel(request.body).then(result => {
    response.json(result)
  })
})

router.post('/electricity-distribution', function (request, response) {
  visualisationsService.getElectricityDistribution(request.body).then(result => {
    response.json(result)
  })
})

router.post('/electricity-distribution-per-research-level', function (request, response) {
  visualisationsService.getElectricityDistributionPerResearchLevel(request.body).then(result => {
    response.json(result)
  })
})

export default router
