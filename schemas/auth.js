const Joi = require("joi");
const { emailRegexp, subscriptionList } = require("../constans/authConstans");

const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string().valid(...subscriptionList),
});

const subscriptionUpdateSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

module.exports = {
  registerSchema,
  subscriptionUpdateSchema,
  emailSchema,
};
