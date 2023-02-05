const express = require('express');
const modsRouter = require('./routes/mods');
const combinationsRouter = require('./routes/combinations');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
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
