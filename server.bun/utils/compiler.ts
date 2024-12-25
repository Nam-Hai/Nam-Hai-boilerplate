import { apiInfo } from "./createServerApi";
import prettier from "prettier"
import { z } from "zod";

const compiler = async () => {
    let string = "export type APIRoutes = {"
    apiInfo.forEach(({ path, outputType, inputType }, index, array) => {
        string += `"${path}": {
            query: ${checkObject(inputType)}
            payload: ${checkObject(outputType)},
        },`
    })
    string += "}"

    const formatted = await prettier.format(string, { parser: "typescript" });
    await Bun.write("./utils/types.ts", formatted)
}

function checkObject(object: Record<any, any>): string {
    let end = ""
    if (object.isArray) {
        delete object.isArray
        end = "[]"
    }

    Object.entries(object).forEach(([key, value]) => {
        if (typeof value === "object") object[key] = checkObject(value)
    })
    return `${objectToString(object)}${end}`
}
function objectToString(object: Record<any, any>) {
    return `{
        ${(() => {
            let string = ""
            Object.entries(object).forEach(([key, value]) => {
                string += `${key}: ${value},\n`
            })
            return string
        })()}
}`
}

// Could just use .toLowerCase I guess but hey
const JavaScriptWrapperObjects = {
    "String": "string", "Number": "string", "Boolean": "boolean", "Symbol": "symbol", "BigInt": "bigint", "Object": "object", "Function": "function"
}
function isKeyOf<Key extends PropertyKey>(object: Record<Key, any>, key: PropertyKey): key is Key {
    return key in object;
}

function toPrimitive(type: string) {
    if (isKeyOf(JavaScriptWrapperObjects, type)) return JavaScriptWrapperObjects[type]
    return type
}

// deep type infer of a z.ZodObject
export function getRuntimeType(schema: z.ZodTypeAny): any {
    if (schema instanceof z.ZodObject) {
        return Object.keys(schema.shape).reduce((acc, key) => {
            const field = schema.shape[key];
            acc[key] = getRuntimeType(field);
            return acc;
        }, {} as Record<string, string>)
    } else if (schema instanceof z.ZodArray) {
        const elementType = getRuntimeType(schema._def.type);
        elementType.isArray = true
        return elementType
    } else if (schema instanceof z.ZodLiteral) {
        return `literal(${JSON.stringify(schema._def.value)})`;
    } else if (schema instanceof z.ZodUnion) {
        return schema._def.options.map(getRuntimeType).join(" | ");
    } else {
        const type = schema._def.typeName.replaceAll("Zod", "");
        return toPrimitive(type)
    }
}

export { compiler }