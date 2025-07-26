import Joi, { ObjectSchema, ValidationResult } from 'joi';

export const messageSchema: ObjectSchema = Joi.object({
  phone: Joi.string().required(),
  message: Joi.string().required(),
});

export function validateMessage(data: unknown): ValidationResult {
  return messageSchema.validate(data);
} 