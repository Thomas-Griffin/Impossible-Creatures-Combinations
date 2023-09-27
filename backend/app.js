const express = require('express');
const modsRouter = require('./routes/modsRoutes');
const combinationsRouter = require('./routes/combinationsRoutes');
const databaseInitializerRouter = require('./routes/databaseRoutes');
const visualisationsRouter = require('./routes/visualisationsRoutes');
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(allowCrossDomain);

app.disable('etag');

app.use('/mods', modsRouter);
app.use('/combinations', combinationsRouter);
app.use('/database', databaseInitializerRouter);
app.use('/visualisations', visualisationsRouter);

module.exports = app;
