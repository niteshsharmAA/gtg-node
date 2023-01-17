const express = require('express')
const cors = require("cors");
const app = express();
// const dotenv = require('dotenv').config()
const { DbDataSource }= require('./db');
// require('./db/dbconfig');
const logger = require('./logger');
// const hostname = '192.168.0.241';
const hostname = '127.0.0.1';
const port = 3000;
const SOCKET = process.env.SOCKET || 3001;
// const HOST_APP = '192.168.0.241:3001';
const http = require('http');
const axios = require("axios")
var fileupload = require("express-fileupload");
const session = require('express-session');
// const socket = require('socket.io');
// var multer = require('multer');
// var upload = multer();
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

var whitelist = ['http://localhost:4200']

app.use(function (req, res, next) {
  // console.log(req.header(('Origin')))
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', ' POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  next();
})
const { success, error, validation } = require('./middleware/responseApi')

// app.use((req, res, next) => {
//   try{
//     var originalSend = res.send;

//     res.send = function(){
//       const response = arguments[0]
//       helper.requestLogger(req, response)
//       originalSend.apply(res, arguments);
//     };
//     next();
//   }catch(err){
//     console.log('err',err);
//     res.json(error(err.message, 400))
//   }
// })

// for parsing multipart/form-data
// app.use(upload.array()); 
app.use(fileupload())
app.use(express.static('public'));
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE" 
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({

  // It holds the secret key for session
  secret: 'rghvuervirdvnirsdfvbniksdbv',

  // Forces the session to be saved
  // back to the session store
  resave: true,

  // Forces a session that is "uninitialized"
  // to be saved to the store
  saveUninitialized: true
}))

app.get("/", function (req, res) {

  value = req.session.key;
  logger.info(value);
  req.session.name = 'testuser'
  return res.send("Session Set")
})

// app.get('/home', function (req, res, next) {
//   console.log(req.session.id);
//   if (req.session.token) {
//     res.send(req.session.token)
//   } else {
//     res.send('invalid')
//   }
// });

app.get("/session", function (req, res) {

  var name = req.session.name
  return res.send(name)

  /*  To destroy session you can use
      this function 
   req.session.destroy(function(error){
      console.log("Session Destroyed")
  })
  */
})

const db = require("./models");
// db.sequelize.sync({alter:true})
// db.sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });



app.get('/', (req, res) => {
})

require("./routers/userRoute")(app);
require("./routers/tradeRoute")(app);
require("./routers/securityRoute")(app);
require("./routers/masterRoute")(app);
require("./routers/swapTradeRoute")(app);
require("./routers/futuretradeRoute")(app);
require("./routers/spottradeRoute")(app);
require("./routers/tradeOrderRoute")(app);
require("./routers/transactionFeeRoute")(app);
require("./routers/currencyRoute")(app);
require("./routers/avatarRoute")(app);
require("./routers/razorpayRoute")(app);
require("./routers/bankVerificationRoute")(app);
require("./routers/faqRouter")(app);
require("./routers/supportTicketsRoute")(app);
require("./routers/ticketConversationRoute")(app);
require("./routers/cexRoute")(app);
const server = http.Server(app);
const socketIO = require('socket.io');
const { helper } = require('./helper/helper');
const io = socketIO(server);


io.on('connection', (socket) => {
  socket.on('new-spot-trade', (checked) => {
    io.emit('new-spot-trade-emited', checked);
  })
  socket.on('new-future-trade', (checked) => {
    io.emit('new-future-trade-emited', checked);
  })
  socket.on('new-buy-order', (checked) => {
    io.emit('new-buy-order-emited', checked);
  })
  socket.on('new-sell-order', (checked) => {
    io.emit('new-sell-order-emited', checked);
  })
  socket.on('new-steck-order', (checked) => {
    io.emit('new-steck-order-emited', checked);
  })
  socket.on('new-swap', (checked) => {
    io.emit('new-swap-emited', checked);
  })
  socket.on('new-farming', (checked) => {
    io.emit('new-farming-emited', checked);
  })
});


app.listen(port, hostname, async () => {
  await DbDataSource.authenticate();
  logger.info(`Server running at http://${hostname}:${port}/`);
});
// app.listen(port, () => {
//   console.log(`Server running at port ${port}/`);
// });

server.listen(SOCKET, () => {
  logger.info(`Example app listening on port ${SOCKET}!`);
});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
require('./endpoints')(app)