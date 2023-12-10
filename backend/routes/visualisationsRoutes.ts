import { Router } from 'express'
import VisualisationsService from '../services/visualisationsService'
import { cache } from '../app'

const router = Router()

const visualisationsService = new VisualisationsService()

router.post('/research-levels-per-stock', async function (request, response) {
  const data = await visualisationsService.getResearchLevelsPerStock(request.body)
  cache.set(request.originalUrl + request.body, data)
  response.json(data)
})

router.post('/coal-distribution', async function (request, response) {
  const data = await visualisationsService.getCoalCostDistribution(request.body)
  cache.set(request.originalUrl + request.body, data)
  response.json(data)
})

router.post('/coal-distribution-per-research-level', async function (request, response) {
  const data = await visualisationsService.getCoalCostDistributionPerResearchLevel(request.body)
  cache.set(request.originalUrl + request.body, data)
  response.json(data)
})

router.post('/electricity-distribution', async function (request, response) {
  const data = await visualisationsService.getElectricityDistribution(request.body)
  cache.set(request.originalUrl + request.body, data)
  response.json(data)
})

router.post('/electricity-distribution-per-research-level', async function (request, response) {
  const data = await visualisationsService.getElectricityDistributionPerResearchLevel(request.body)
  cache.set(request.originalUrl + request.body, data)
  response.json(data)
})

export default router
