import { Liquid } from "liquidjs";
import * as changeCase from "change-case";
let engine: Liquid | null = null;
export function useLiquidEngine() {
    if (!import.meta.client) {
        return null
    }
    if (engine) {
        return engine
    }
    engine = new Liquid();

    engine.registerTag('meta', {
        parse: function (tagToken, remainTokens) {
            this.templates = []

            let token
            const stream = engine!.parser.parseStream(remainTokens)
            stream.on('tag:endmeta', () => {
                stream.stop()
            })
                .on('template', (tpl) => {
                    this.templates.push(tpl)
                })
            stream.start()
        },

        render: function* (ctx, hash) {
            // Just like comment: don't render anything
            return ''
        }
    })
    engine.registerFilter('schema_flatten', (input, arg1) => {
        if (typeof arg1 === 'string')
            return generateSchemaForCodegen(input, arg1);
        return generateSchemaForCodegen(input);
    });
    engine.registerFilter('keys', (input) => {
        return Object.keys(input);
    });
    engine.registerFilter('pascal_case', changeCase.pascalCase);
    engine.registerFilter('snake_case', changeCase.snakeCase);
    engine.registerFilter('kebab_case', changeCase.kebabCase);
    engine.registerFilter('constant_case', changeCase.constantCase);
    engine.registerFilter('camel_case', changeCase.camelCase);
    return engine
}