import ModService from '../services/modService'
import { Router } from 'express'

const router = Router()
const modService = new ModService()

router.get('/', function (_request, response) {
  modService.getMods().then(mods => {
    response.json(mods)
  })
})

router.get('/name/:name', function (request, response) {
  modService.getModsByName(request.params.name).then(mod => {
    response.json(mod)
  })
})

export default router
