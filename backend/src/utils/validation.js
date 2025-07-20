const Joi = require('joi');

const messageSchema = Joi.object({
  phone: Joi.string().required(),
  message: Joi.string().required(),
});

function validateMessage(data) {
  return messageSchema.validate(data);
}

module.exports = { messageSchema, validateMessage }; 