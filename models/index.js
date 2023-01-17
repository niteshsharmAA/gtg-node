// local imports
const { DbDataSource } = require('../db/index');
const logger = require('../logger');
// All Schemas --------------
// Schemas
const { success, error, validation } = require('../middleware/responseApi')
const UserSchema = require("./userModel.js");
const CountrySchema = require("./countryModel.js");
const StateSchema = require("./stateModel.js");
const CitySchema = require("./cityModel.js");
const AddressSchema = require('./addressModel');
const BuyTradeSchema = require('./buytradeModel.js');
const SellTradeSchema = require("./sellTradeModel");
const FutureBuyTradeSchema = require('./futurebuytradeModel.js');
const FutureSellTradeSchema = require('./futureselltradeModel.js');
const DocumentSchema = require("./documentModel");
const VerificationSchema = require("./kycVerificationModel");
const TradePairSchema = require('./tradepairModel.js');
const SessionSchema = require('./sessionModel.js');
const ContactSchema = require('./contactModel.js');
const swapModel = require("./swapTradeModel.js")
const liveCoinPriceModel = require("./liveCurrencyPriceModel")
const swapLiquidityModel = require("./swapLiquidityModel")
const poolModel = require("./poolsModel")
const avatar = require("./avatarModel")
const transactionModel = require("./transactionModel")
const currencyModel = require("./currencyModel")
const transactionFeesModel = require("./transactionFeesModel")
const bankVerificationModel = require("./bankVerificationModel")
const faqModel = require("./faqModel")
const supportTicketModel = require("./supportTicketModel")
const ticketConversationModel = require("./ticketConversationModel")
const spotbuytradeModel = require('./spotbuytradeModel.js')
const tradeOrderModel = require('./tradeOrderModel.js')
const spotselltradeModel = require('./spotselltradeModel.js')
const userProfileModel = require('./userProfileModel.js')
const userLoggerModel = require('./userLoggerModel');
const razorpaypaymentModel = require('./razorpaypaymentModel')

// Master Schemas

// All Schemas Ends--------------
// let dbManager;

// exports.getDb1Manager = () => {
//     // if (dbManager) return Promise.resolve(dbManager);
//     return createDB1Manager();
// };

exports.createDB1Manager = async () => {
    try {
        const dbConn = await DbDataSource;
        const User = dbConn.define('users', UserSchema.schema, UserSchema.options);
        const TradePairs = dbConn.define('tradepairs', TradePairSchema.schema, TradePairSchema.options);
        const State = dbConn.define('states', StateSchema.schema, StateSchema.options);
        const Session = dbConn.define('sessions', SessionSchema.schema, SessionSchema.options);
        const Verification = dbConn.define('kycVerification', VerificationSchema.schema, VerificationSchema.options);
        const Document = dbConn.define('documents', DocumentSchema.schema, DocumentSchema.options);
        const futureSellTrade = dbConn.define('futureselltrade', FutureSellTradeSchema.schema, FutureSellTradeSchema.options);
        const futureBuyTrade = dbConn.define('futurebuytrade', FutureBuyTradeSchema.schema, FutureBuyTradeSchema.options);
        const sellTrade = dbConn.define('selltrade', SellTradeSchema.schema, SellTradeSchema.options);
        const buyTrade = dbConn.define('buytrade', BuyTradeSchema.schema, BuyTradeSchema.options);
        const Address = dbConn.define('address', AddressSchema.schema, AddressSchema.options);
        const Country = dbConn.define('countries', CountrySchema.schema, CountrySchema.options);
        const City = dbConn.define('cities', CitySchema.schema, CitySchema.options);
        const Contact = dbConn.define('contacts', ContactSchema.schema, ContactSchema.options);
        const Swap = dbConn.define('swaptrading', swapModel.schema, swapModel.options);
        const liveCoinPrice = dbConn.define('currencyprice', liveCoinPriceModel.schema, liveCoinPriceModel.options);
        const swapLiquidity = dbConn.define('swapliquidity', swapLiquidityModel.schema, swapLiquidityModel.options);
        const Pool = dbConn.define('pool', poolModel.schema, poolModel.options);
        const Avatar = dbConn.define('avatars', avatar.schema, avatar.options);
        const Transaction = dbConn.define('transactions', transactionModel.schema, transactionModel.options);
        const Currency = dbConn.define('currency', currencyModel.schema, currencyModel.options);
        const transactionFees = dbConn.define('transactionfees', transactionFeesModel.schema, transactionFeesModel.options);
        const BankUserDetails = dbConn.define('bankuserdetails', bankVerificationModel.schema, bankVerificationModel.options);
        const faq = dbConn.define('faq', faqModel.schema, faqModel.options);
        const supportTicket = dbConn.define('supportTicket', supportTicketModel.schema, supportTicketModel.options);
        const ticketConversation = dbConn.define('ticketConversation', ticketConversationModel.schema, ticketConversationModel.options);
        const spotBuyTrade = dbConn.define('spotbuytrade', spotbuytradeModel.schema, spotbuytradeModel.options);
        const tradeOrder = dbConn.define('tradeOrder', tradeOrderModel.schema, tradeOrderModel.options);
        const spotSellTrade = dbConn.define('spotselltrade', spotselltradeModel.schema, spotselltradeModel.options);
        const userProfile = dbConn.define('user_profile', userProfileModel.schema, userProfileModel.options);
        const userRequestLogger = dbConn.define('user_logger', userLoggerModel.schema, userLoggerModel.options)
        const razorpaypayment = dbConn.define('razorpaypayment', razorpaypaymentModel.schema, razorpaypaymentModel.options);
         // Address Table Foreign Key Connections
        // Address.belongsTo(User, { foreignKey: 'uid' });
        // User.hasMany(Address, { foreignKey: 'uid' });
        // Address Table Foreign Key Connections
        // Address.belongsTo(Country, { foreignKey: 'country_id' });
        // Country.hasMany(Address, { foreignKey: 'country_id' });
        // // Address Table Foreign Key Connections
        // Address.belongsTo(State, { foreignKey: 'state_id' });
        // State.hasMany(Address, { foreignKey: 'state_id' });
        // buyTrade Table Foreign Key Connections
        // buyTrade.belongsTo(User, { foreignKey: 'uid' });
        // User.hasMany(buyTrade, { foreignKey: 'uid' });
        // sellTrade Table Foreign Key Connections
        // sellTrade.belongsTo(User, { foreignKey: 'uid' });
        // User.hasMany(sellTrade, { foreignKey: 'uid' });
        // Verification Table Foreign Key Connections
        // Verification.belongsTo(User, { foreignKey: 'uid' });
        // User.hasMany(Verification, { foreignKey: 'uid' });
        // // futureBuyTrade Table Foreign Key Connections
        // futureBuyTrade.belongsTo(User, { foreignKey: 'uid' });
        // User.hasMany(futureBuyTrade, { foreignKey: 'uid' });
        // // futureSellTrade Table Foreign Key Connections
        // futureSellTrade.belongsTo(User, { foreignKey: 'uid' });
        // User.hasMany(futureSellTrade, { foreignKey: 'uid' });
        let dbManager = {
            dbConn,
            User,
            TradePairs,
            State,
            Session,
            Verification,
            Document,
            futureSellTrade,
            futureBuyTrade,
            sellTrade,
            buyTrade,
            Address,
            Country,
            City,
            Contact,
            Swap,
            Transaction,
            liveCoinPrice,
            Avatar,
            Currency,
            swapLiquidity,
            Pool,
            transactionFees,
            BankUserDetails,
            faq,
            supportTicket,
            ticketConversation,
            spotBuyTrade,
            spotSellTrade,
            tradeOrder,
            userProfile,
            userRequestLogger,
            razorpaypayment,
        };
      //  global.dbManager = dbManager;
        // create tables if not available (Only for Dev purpose)
        try {
            await dbConn.sync();
            logger.info('DB1 sync successfully');
        } catch (err) {
            console.log('err',err);
            logger.info('Errors occured while syncing DB1',err);
            throw err;
        }
        return dbManager;
    } catch (error) {
        logger.info(error);
        process.exit(0);
    }
}

// create DB1 Manager
this.createDB1Manager();
// createDB1Manager();
