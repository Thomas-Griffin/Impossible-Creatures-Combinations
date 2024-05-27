const jestMongodbConfig = {
    mongodbMemoryServerOptions: {
        binary: {
            skipMD5: true,
        },
        autoStart: false,
        instance: {},
    },
}
export default jestMongodbConfig
