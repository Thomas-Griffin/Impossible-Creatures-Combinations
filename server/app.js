const express = require('express');
const modsRouter = require('./routes/modsRoutes');
const combinationsRouter = require('./routes/combinationsRoutes');
const morgan = require("morgan");
const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.disable('etag');
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);

app.use('/mods', modsRouter);
app.use('/combinations', combinationsRouter);
module.exports = app;
