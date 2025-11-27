import { validateJsonWithSchema, validateSchema } from './schemaUtils';

describe('schemaUtils', () => {
    describe('validateSchema', () => {
        it('should return valid for a correct schema', () => {
            const schema = '{"type": "object", "properties": {"name": {"type": "string"}}}';
            const result = validateSchema(schema);
            expect(result.isValid).toBe(true);
            expect(result.schema).toEqual(JSON.parse(schema));
        });

        it('should return invalid for an incorrect schema', () => {
            const schema = '{"type": "invalid_type"}';
            // AJV might not throw on unknown types depending on config, but let's try a syntax error
            const badJson = '{ type: "object" }'; // Invalid JSON
            const result = validateSchema(badJson);
            expect(result.isValid).toBe(false);
        });
    });

    describe('validateJsonWithSchema', () => {
        const schema = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'number' }
            },
            required: ['name']
        };

        it('should return valid for matching JSON', () => {
            const data = { name: 'John', age: 30 };
            const result = validateJsonWithSchema(data, schema);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should return invalid for non-matching JSON', () => {
            const data = { age: 30 }; // Missing name
            const result = validateJsonWithSchema(data, schema);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0].message).toContain('must have required property');
        });

        it('should return invalid for wrong type', () => {
            const data = { name: 123 }; // Wrong type
            const result = validateJsonWithSchema(data, schema);
            expect(result.isValid).toBe(false);
            expect(result.errors[0].message).toContain('must be string');
        });
    });
});
