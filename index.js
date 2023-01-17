const app = require('express')()
const http = require('http')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const port = 3002;
http.createServer(app).listen(port)
console.log("Swagger Listening at:// port:%s (HTTP)", port)

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./endpoints')(app)