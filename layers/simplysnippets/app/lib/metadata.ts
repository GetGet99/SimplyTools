import * as YAML from "yaml";
import { z } from "zod";

export type Metadata = {
    name: string;
    description: string;
    lang: string;
    properties: Record<string, any>;
    example: Record<string, any>;
};
// export function getMetadata(text: string): Metadata | null {
//     try {
//         return YAML.parse(extractYamlComment(text) ?? '') as Metadata
//     } catch {
//         return null
//     }
// }

export function extractYamlComment(text: string): string | null {
    const match = text.match(/{%-?\s*meta\s*-?%}([\s\S]*?){%-?\s*endmeta\s*-?%}/);
    return match ? match[1]!.trim() : null;
}

export function yamlToZod(meta: Metadata): Record<string, z.ZodTypeAny> {
    const mapType = (type: any): z.ZodTypeAny => {
        if (typeof type === "string") {
            switch (type.toLowerCase()) {
                case "string": return z.string();
                case "number": return z.number();
                case "boolean": return z.boolean();
                default: return z.any();
            }
        }
        if (Array.isArray(type)) {
            // e.g. [{ name: string, price: number }]
            return z.array(z.object(Object.fromEntries(
                Object.entries(type[0]).map(([k, v]) => [k, mapType(v)])
            )));
        }
        if (typeof type === "object") {
            return z.object(Object.fromEntries(
                Object.entries(type).map(([k, v]) => [k, mapType(v)])
            ));
        }
        return z.any();
    };

    return Object.fromEntries(
        Object.entries(meta.properties).map(([k, v]) => [k, mapType(v)])
    );
}
