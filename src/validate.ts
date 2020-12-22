
import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';

const ajv = new Ajv();

const tagSchema: JSONSchemaType<string> = {
  type: 'string',
  minLength: 1,
  maxLength: 128,
  pattern: '[a-zA-Z0-9_]+',
};

const idSchema: JSONSchemaType<string> = {
  type: 'string',
  minLength: 2,
  maxLength: 128,
  pattern: '[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9]',
};

export function validateWrapper(validate: ValidateFunction) {
  return (params: any) => {
    if (!validate(params)) {
      throw new Error(ajv.errorsText(validate.errors).replace('/', '.'));
    }
  };
}

export const validateCreateObjects = validateWrapper(ajv.compile({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      tag: tagSchema,
      id: idSchema,
    },
    required: ['tag'],
  },
  minItems: 1,
  maxItems: 100,
}));

export const validateDeleteObjects = validateWrapper(ajv.compile({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: idSchema,
    },
    required: ['id'],
  },
  minItems: 1,
  maxItems: 100,
}));

export const validateCreateOrDeleteLinks = validateWrapper(ajv.compile({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      fromId: idSchema,
      linkTag: tagSchema,
      toId: idSchema,
    },
    required: ['fromId', 'linkTag', 'toId'],
  },
  minItems: 1,
  maxItems: 50,
}));

export const validateQuery = validateWrapper(ajv.compile({
  type: 'string',
  minLength: 4, // (?a)
}));

