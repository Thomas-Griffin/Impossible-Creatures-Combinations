import CombinerService from './BasicCombinerService';
import {CombinerAction, CombinerRequest, StockAttributesMap,} from './App/Services/Combiner/CombinerInterfaces';
import Express from 'express'

const app = Express()
// Let's say a user is sending requests to us on port 8000 and that user just wants to get all the attributes of all the stocks.
const port = 8000

const comb_req: CombinerRequest = {
    action: CombinerAction.GetStocks
}

async function getStocks() {
    const stocks: StockAttributesMap = await CombinerService.sendCombinerRequest<StockAttributesMap>(comb_req)
    return stocks
}

// This super simplified get request just returns all Tellurian stock animals.
app.get("/", async (req, res) => {
    // So let's say you get some request, and you want to serve it, and to do so you need to get some information from the combiner backend
    // (ie you need to get some info about stocks). Normally you'd presumably have some middleware or whatever running here; for this simplified
    // example I just wrote the getStocks function above and I serve its results to the user.
    let stocks_from_backend = await getStocks()
    res.send(stocks_from_backend)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})