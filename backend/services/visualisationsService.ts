import MongoService from './mongoService'
import { Data } from 'plotly.js'
import Mod from '../types/Mod'
import { JOI_CHART_REQUEST_BODY_SCHEMA, JOI_MOD_SCHEMA } from '../globalConstants'
import ChartRequestBody from '../types/ChartRequestBody'
import Joi from 'joi'
import StockPerResearchLevel from '../types/StockPerResearchLevel'

type AggregationStage = Record<string, any>

class VisualisationsService extends MongoService {
  constructor() {
    super()
  }

  async getStockPerResearchLevel(body: ChartRequestBody): Promise<Partial<Data>[]> {
    return new ChartQueryPipeline(body, [
      {
        $group: {
          _id: {
            $cond: {
              if: '$Animal 1',
              then: '$Animal 1',
              else: '$Animal 2',
            },
          },
          researchLevel: {
            $push: '$Research Level',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $unwind: '$researchLevel',
      },
      {
        $group: {
          _id: {
            animal: '$_id',
            researchLevel: '$researchLevel',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $group: {
          _id: '$_id.researchLevel',
          animals: {
            $push: {
              animal: '$_id.animal',
              count: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          researchLevel: '$_id',
          animals: 1,
        },
      },
      {
        $sort: {
          researchLevel: 1,
        },
      },
    ])
      .execute()
      .then(queryResult => {
        let chartData = [] as Partial<Data>[]
        for (let i = 1; i <= 5; i++) {
          const researchLevel = (queryResult as unknown as StockPerResearchLevel[]).find(
            obj => obj?.researchLevel === i
          )
          if (researchLevel) {
            chartData.push({
              name: `Research Level ${i}`,
              text: researchLevel.animals.map(obj => `${obj.animal}`),
              textposition: 'auto',
              type: body?.chartOptions?.chartType || 'bar',
              x: researchLevel.animals.map(obj => obj.animal),
              y: researchLevel.animals.map(obj => obj.count),
            })
          }
        }
        return chartData as Partial<Data>[]
      })
  }

  async getAttributeChart(body: ChartRequestBody): Promise<Partial<Data>[]> {
    const attributeMax = await new ChartQueryPipeline(body, [
      {
        $group: {
          _id: null,
          max: { $max: `$${body.attributes.x}` },
        },
      },
    ])
      .execute()
      .then(result => {
        const resultAsRecordArray = result as unknown as Record<string, any>[]
        return resultAsRecordArray[0]?.['max'] || 0
      })
    return new ChartQueryPipeline(body, [
      {
        $bucket: {
          groupBy: `$${body.attributes.x}`,
          boundaries: [
            0,
            ...Array.from({ length: Math.ceil(attributeMax / (body?.bucketSize || 1)) }, (_, i) => {
              return (i + 1) * (body?.bucketSize || 1)
            }),
          ],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            lower: { $min: `$${body.attributes.x}` },
            upper: { $max: `$${body.attributes.x}` },
          },
        },
      },
      {
        $project: {
          _id: 0,
          range: '$_id',
          count: 1,
          lower: 1,
          upper: 1,
        },
      },
    ])
      .execute()
      .then(queryResult => {
        const queryResultAsRecordArray = queryResult as unknown as Record<string, any>[]
        return [
          {
            x: queryResultAsRecordArray.map(obj => {
              return obj['lower'] === obj['upper']
                ? `${body?.attributes?.x} ${obj['lower']}`
                : `${body?.attributes?.x} ${obj['lower']} - ${obj['upper']}`
            }),
            y: queryResultAsRecordArray.map(obj => obj['count']),
            text: queryResultAsRecordArray.map(obj => obj['count'].toString()),
            type: body?.chartOptions?.chartType || 'bar',
          } as Partial<Data>,
        ] as Partial<Data>[]
      })
  }

  async getXPerYChart(body: ChartRequestBody): Promise<Partial<Data>[]> {
    const xAttributeMax = await new ChartQueryPipeline(body, [
      {
        $group: {
          _id: null,
          max: { $max: `$${body.attributes.x}` },
        },
      },
    ])
      .execute()
      .then(result => {
        const resultAsRecordArray = result as unknown as Record<string, any>[]
        return resultAsRecordArray[0]?.['max'] || 0
      })

    return new ChartQueryPipeline(
      body,
      //   [
      //   {
      //     $group: {
      //       _id: `$${body.attributes.y}`,
      //       xCount: {
      //         $push: `$${body.attributes.x}`,
      //       },
      //     },
      //   },
      //   {
      //     $unwind: '$xCount',
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         y: '$_id',
      //         x: '$xCount',
      //       },
      //       count: {
      //         $sum: 1,
      //       },
      //     },
      //   },
      //   {
      //     $sort: {
      //       '_id.y': 1,
      //     },
      //   },
      // ]

      [
        {
          $bucket: {
            groupBy: `$${body.attributes.y}`,
            boundaries: [
              0,
              ...Array.from({ length: Math.ceil(xAttributeMax / (body?.bucketSize || 1)) }, (_, i) => {
                return (i + 1) * (body?.bucketSize || 1)
              }),
            ],
            default: 'Other',
            output: {
              x: {
                $push: `$${body.attributes.x}`,
              },
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]
    )
      .execute()
      .then(queryResult => {
        const queryResultAsRecordArray = queryResult as unknown as Record<string, any>[]
        return queryResultAsRecordArray.map(obj => {
          const xSorted = obj?.['x']?.sort((a: number, b: number) => a - b)
          const dataLength = obj?.['x']?.length
          return {
            x: [obj['_id']],
            y: [xSorted?.length],
            text:
              xSorted.length === 1
                ? `${body?.attributes?.x} ${xSorted[0]} ${body?.attributes?.y}: ${obj?.['_id']}`
                : `${body?.attributes?.x} ${xSorted[0]} - ${xSorted[dataLength - 1]} ${body?.attributes?.y}: ${obj?.[
                    '_id'
                  ]}`,
            name: `${body?.attributes?.y}: ${obj?.['_id']}`,
            type: body?.chartOptions?.chartType || 'bar',
          } as Partial<Data>
        }) as Partial<Data>[]
      })
  }
}

interface MongoRequestBody {
  mod: Mod
  columns?: string[]
}

class MongoQueryPipeline {
  body: MongoRequestBody
  service: MongoService
  query: AggregationStage[]
  bodySchema: Joi.ObjectSchema
  queryResult: Document[]

  constructor(body: MongoRequestBody, bodySchema: Joi.ObjectSchema, query: AggregationStage[]) {
    this.body = body
    this.bodySchema = bodySchema || JOI_MOD_SCHEMA
    this.service = new MongoService()
    this.query = query
    this.queryResult = [] as Document[]
  }

  async execute() {
    try {
      const validationError = this.validateBody(this.body)
      if (validationError) {
        console.error(validationError)
        return [] as Document[]
      }
      this.queryResult = await this.getQueryResult()
      return this.queryResult
    } catch (err) {
      console.error(err)
      return [] as Document[]
    }
  }

  private toCollectionName(mod: Mod) {
    return `${mod?.name} ${mod?.version}`
  }

  private validateBody(body: MongoRequestBody) {
    const { error } = this.bodySchema.validate(body)
    return error
  }

  private async getQueryResult() {
    try {
      await this.service.client.connect()
      const response = await this.service.client
        .db(process.env['MONGO_DB_NAME'])
        .collection(this.toCollectionName(this.body.mod))
        .aggregate(this.query)
        .toArray()
      await this.service.client.close()
      return response as Document[]
    } catch (err) {
      console.error(err)
      return [] as Document[]
    }
  }
}

class ChartQueryPipeline extends MongoQueryPipeline {
  constructor(body: ChartRequestBody, query: AggregationStage[]) {
    super(body, JOI_CHART_REQUEST_BODY_SCHEMA, query)
  }
}

export default VisualisationsService
