import {Data} from 'plotly.js'
import {MongoClient} from 'mongodb'
import MongoService from '@backend/services/mongoService'
import VisualisationServiceQuery from '@backend/services/VisualisationServiceQuery'
import CombinationVisualisationRequestBody from '~types/CombinationVisualisationRequestBody'

class VisualisationsService {
    client: MongoClient

    constructor() {
        this.client = new MongoService().client
    }

    async getAttributeChart(body: CombinationVisualisationRequestBody): Promise<Partial<Data>[]> {
        const attributeMax = await this.getMaximumXAttributeValue(body)
        const boundaries = [
            0,
            ...Array.from(
                {
                    length: Math.ceil(attributeMax / (body?.bucketSize || 1)),
                },
                (_, i) => {
                    return (i + 1) * (body?.bucketSize || 1)
                }
            ),
        ]
        return new VisualisationServiceQuery(body, [
            {$match: {Mod: body.mod}},
            {
                $bucket: {
                    groupBy: `$${body.attributes.x}`,
                    boundaries: boundaries.length === 1 ? [0, Number.MAX_SAFE_INTEGER] : boundaries,
                    default: 'Other',
                    output: {
                        count: {$sum: 1},
                        lower: {$min: `$${body.attributes.x}`},
                        upper: {$max: `$${body.attributes.x}`},
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

    async getXPerYChart(body: CombinationVisualisationRequestBody): Promise<Partial<Data>[]> {
        const xAttributeMax = await this.getMaximumXAttributeValue(body)
        const boundaries = [
            0,
            [...Array(Math.ceil(xAttributeMax / (body?.bucketSize || 1))).keys()].map(
                i => (i + 1) * (body?.bucketSize || 1)
            ),
        ].flat()
        return new VisualisationServiceQuery(body, [
            {$match: {Mod: body.mod}},
            {
                $bucket: {
                    groupBy: `$${body.attributes.y}`,
                    boundaries: boundaries.length === 1 ? [0, Number.MAX_SAFE_INTEGER] : boundaries,
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
        ])
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
                                : `${body?.attributes?.x} ${xSorted[0]} - ${xSorted[dataLength - 1]} ${
                                      body?.attributes?.y
                                  }: ${obj?.['_id']}`,
                        name: `${body?.attributes?.y}: ${obj?.['_id']}`,
                        type: body?.chartOptions?.chartType || 'bar',
                    } as Partial<Data>
                }) as Partial<Data>[]
            })
    }

    private async getMaximumXAttributeValue(body: CombinationVisualisationRequestBody) {
        return await new VisualisationServiceQuery(body, [
            {$match: {Mod: body.mod}},
            {
                $group: {
                    _id: null,
                    max: {$max: `$${body.attributes.x}`},
                },
            },
        ])
            .execute()
            .then(result => {
                const resultAsRecordArray = result as unknown as Record<string, any>[]
                return resultAsRecordArray[0]?.['max'] || 0
            })
    }
}

export default VisualisationsService
