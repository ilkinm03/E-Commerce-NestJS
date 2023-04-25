import * as Joi from "joi";

export class ConfigSchema {
  NODE_ENV: Joi.StringSchema = Joi.string().valid(
    "production",
    "development",
    "test",
  ).required();
  DATABASE_URL: Joi.StringSchema = Joi.string().required();
  JWT_ACCESS_TOKEN_SECRET: Joi.StringSchema = Joi.string().required();
  JWT_REFRESH_TOKEN_SECRET: Joi.StringSchema = Joi.string().required();
  JWT_ACCESS_TOKEN_EXP_TIME: Joi.NumberSchema = Joi.number().required();
  JWT_REFRESH_TOKEN_EXP_TIME: Joi.NumberSchema = Joi.number().required();
}