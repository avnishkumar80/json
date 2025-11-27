import { useState, useCallback } from 'react';
import { validateJsonWithSchema, validateSchema } from '../utils/schemaUtils';

export const useSchemaValidation = () => {
    const [schema, setSchema] = useState(null);
    const [schemaString, setSchemaString] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [isSchemaValid, setIsSchemaValid] = useState(true);
    const [schemaError, setSchemaError] = useState('');

    const updateSchema = useCallback((newSchemaString) => {
        setSchemaString(newSchemaString);
        if (!newSchemaString.trim()) {
            setSchema(null);
            setIsSchemaValid(true);
            setSchemaError('');
            return;
        }

        const result = validateSchema(newSchemaString);
        if (result.isValid) {
            setSchema(result.schema);
            setIsSchemaValid(true);
            setSchemaError('');
        } else {
            setSchema(null);
            setIsSchemaValid(false);
            setSchemaError(result.error);
        }
    }, []);

    const validate = useCallback((jsonContent) => {
        if (!schema || !jsonContent) {
            setValidationErrors([]);
            return true;
        }

        try {
            const parsedJson = JSON.parse(jsonContent);
            const result = validateJsonWithSchema(parsedJson, schema);
            setValidationErrors(result.errors);
            return result.isValid;
        } catch (e) {
            // If JSON is invalid, we don't validate against schema yet
            // The main editor validation handles syntax errors
            return false;
        }
    }, [schema]);

    const clearSchema = useCallback(() => {
        setSchema(null);
        setSchemaString('');
        setValidationErrors([]);
        setIsSchemaValid(true);
        setSchemaError('');
    }, []);

    return {
        schema,
        schemaString,
        validationErrors,
        isSchemaValid,
        schemaError,
        updateSchema,
        validate,
        clearSchema
    };
};
