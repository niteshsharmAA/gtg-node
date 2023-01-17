
// const swaggerAutogen = require('swagger-autogen')()

// const outputFile = './swagger_output.json'
// const endpointsFiles = ['./endpoints.js']

// swaggerAutogen(outputFile, endpointsFiles)

const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = [
    './endpoints.js',
    './routers/avatarRoute.js',
    './routers/cityRoute.js',
    './routers/countryRoute.js',
    './routers/currencyRoute.js',
    './routers/futuretradeRoute.js',
    './routers/masterRoute.js',
    './routers/razorpayRoute.js',
    './routers/securityRoute.js',
    './routers/spottradeRoute.js',
    './routers/stateRoute.js',
    './routers/swapTradeRoute.js',
    './routers/tradeRoute.js',
    './routers/transactionFeeRoute.js',
    './routers/userRoute.js',
]

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./index.js')
})