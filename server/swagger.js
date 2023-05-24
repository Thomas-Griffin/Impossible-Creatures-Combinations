const doc = {
    info: {
        title: 'Combinations API',
        description: 'Documentation',
        version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
};


const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];


swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app.js');
});



