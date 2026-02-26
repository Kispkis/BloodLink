const Joi = require('joi');
const HttpError = require('../utils/httpError');

const podeDoarSchema = Joi.object({
  age: Joi.number().integer().min(0).required(),
  weightKg: Joi.number().min(0).required(),
  anemia: Joi.boolean().required(),
  firstDonation: Joi.boolean().default(false),
  hadTattooOrPiercingRecently: Joi.boolean().default(false),
  hadFluOrFeverLast7Days: Joi.boolean().default(false),
  finishedAntibioticsLast7Days: Joi.boolean().default(false),
});

function validatePodeDoarPayload(payload) {
  const { value, error } = podeDoarSchema.validate(payload, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    throw new HttpError(
      400,
      'Payload inválido para avaliação de elegibilidade.',
      error.details.map((detail) => detail.message),
    );
  }

  return value;
}

module.exports = {
  validatePodeDoarPayload,
};
