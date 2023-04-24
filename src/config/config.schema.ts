import * as Joi from "joi";

export class ConfigSchema {
  NODE_ENV: Joi.StringSchema = Joi.string().valid(
    "production",
    "development",
    "test",
  ).required();
  DATABASE_URL: Joi.StringSchema = Joi.string().required();
}