import Ajv from 'ajv';
import addFormats from 'ajv-formats';

/**
 * Validates JSON data against a JSON Schema.
 * @param {Object} data - The JSON data to validate.
 * @param {Object} schema - The JSON Schema to validate against.
 * @returns {Object} - Result object with isValid boolean and errors array.
 */
export const validateJsonWithSchema = (data, schema) => {
  try {
    const ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(ajv);
    
    const validate = ajv.compile(schema);
    const valid = validate(data);
    
    if (valid) {
      return { isValid: true, errors: [] };
    }
    
    return {
      isValid: false,
      errors: validate.errors.map(err => ({
        path: err.instancePath,
        message: err.message,
        params: err.params,
        keyword: err.keyword,
        schemaPath: err.schemaPath
      }))
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [{
        path: '',
        message: `Schema Error: ${error.message}`,
        params: {},
        keyword: 'schema_error'
      }]
    };
  }
};

/**
 * Validates if a string is a valid JSON Schema.
 * @param {string} schemaString - The schema string to validate.
 * @returns {Object} - Result object with isValid boolean and parsed schema or error.
 */
export const validateSchema = (schemaString) => {
  try {
    const schema = JSON.parse(schemaString);
    const ajv = new Ajv();
    addFormats(ajv);
    ajv.compile(schema); // Try to compile to check validity
    return { isValid: true, schema };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};
