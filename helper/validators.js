const { required } = require("joi");
const Joi = require("joi");
const { join } = require("path");

exports.liquidityVal = Joi.object({
    poolId: Joi.string().required(),
    quoteasset: Joi.string().required(),
    baseasset: Joi.string().required(),
    fromcurrency: Joi.required(),
    type: Joi.required(),
    type: Joi.required(),
});

exports.addSwapTradeVal = Joi.object({
    quoteasset:Joi.string().required(),
    baseasset:Joi.string().required(),
    fromcurrency:Joi.required(),
})
