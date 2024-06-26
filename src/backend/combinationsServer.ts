import express, {NextFunction, Request, Response} from 'express'
import modsRouter from './routes/modsRoutes'
import combinationsRouter from './routes/combinationsRoutes'
import databaseInitializerRouter from './routes/databaseRoutes'
import visualisationsRouter from './routes/visualisationsRoutes'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import NodeCache from 'node-cache'
import path from 'path'
import {ROOT_DIRECTORY} from '../globals'

export const cache = new NodeCache()
const swaggerFile = JSON.parse(fs.readFileSync(path.resolve(ROOT_DIRECTORY, 'swagger.json'), 'utf8'))

const cacheMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const key = request.originalUrl
    const cachedResponse = cache.get(key)
    if (cachedResponse) {
        response.send(cachedResponse)
    } else {
        next()
    }
}

const allowCrossDomain = (_request: express.Request, response: express.Response, next: express.NextFunction) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
}

const combinationsServer = express()

combinationsServer.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
combinationsServer.use(morgan('dev'))
combinationsServer.use(express.json())
combinationsServer.use(express.urlencoded({extended: false}))
combinationsServer.use(allowCrossDomain)
combinationsServer.disable('etag')

combinationsServer.use('/mods', modsRouter)
combinationsServer.use('/combinations', combinationsRouter)
combinationsServer.use('/database', databaseInitializerRouter)
combinationsServer.use('/visualisations', visualisationsRouter)

combinationsServer.use(cacheMiddleware)
export default combinationsServer
