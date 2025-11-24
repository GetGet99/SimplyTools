export function generateSchema(value: any): any {
    const seen = new WeakSet();
    function inner(v: any): any {
        if (v === null) return { type: 'null' };
        const t = typeof v;
        if (t === 'string') return { type: 'string' };
        if (t === 'boolean') return { type: 'boolean' };
        if (t === 'number') return Number.isInteger(v) ? { type: 'integer' } : { type: 'number' };
        if (Array.isArray(v)) {
            if (v.length === 0) return { type: 'array', items: {} };
            const itemSchemas = v.map(inner);
            const uniq: any[] = [];
            const seenStr = new Set<string>();
            for (const s of itemSchemas) {
                const key = JSON.stringify(s);
                if (!seenStr.has(key)) {
                    seenStr.add(key);
                    uniq.push(s);
                }
            }
            if (uniq.length === 1) {
                return { type: 'array', items: uniq[0] };
            } else {
                return { type: 'array', items: { anyOf: uniq } };
            }
        }
        if (t === 'object') {
            if (seen.has(v)) return { type: 'object' };
            seen.add(v);
            const props: Record<string, any> = {};
            const required: string[] = [];
            for (const key of Object.keys(v)) {
                props[key] = inner(v[key]);
                required.push(key);
            }
            const schema: any = { type: 'object', properties: props };
            if (required.length) schema.required = required;
            schema.additionalProperties = false;
            return schema;
        }
        return {};
    }
    return inner(value);
}
export type CodegenSchema = Record<string, Record<string, string>>;

export function generateSchemaForCodegen(value: any, rootName = 'RootClass'): CodegenSchema {
    const seen = new WeakMap<any, string>();
    const schema: CodegenSchema = {};

    function inner(obj: any, className: string): string {
        if (seen.has(obj)) return seen.get(obj)!;
        seen.set(obj, className);

        const props: Record<string, string> = {};

        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val === null) {
                props[key] = 'object';
            } else if (Array.isArray(val)) {
                if (val.length === 0) {
                    props[key] = 'object[]';
                } else {
                    const firstType = innerType(val[0], key);
                    props[key] = firstType + '[]';
                }
            } else if (typeof val === 'object') {
                const nestedClassName = key;
                inner(val, nestedClassName);
                props[key] = nestedClassName;
            } else {
                props[key] = primitiveType(val);
            }
        }

        schema[className] = props;
        return className;
    }

    function innerType(v: any, key: string): string {
        if (v === null) return 'object';
        if (Array.isArray(v)) return innerType(v[0], key) + '[]';
        if (typeof v === 'object') {
            const nestedClassName = key;
            inner(v, nestedClassName);
            return nestedClassName;
        }
        return primitiveType(v);
    }

    function primitiveType(v: any): string {
        switch (typeof v) {
            case 'string': return 'string';
            case 'number': return Number.isInteger(v) ? 'int' : 'double';
            case 'boolean': return 'bool';
            default: return 'object';
        }
    }

    inner(value, rootName);
    return schema;
}
