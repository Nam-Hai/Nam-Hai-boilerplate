import { apiInfo } from "./createServerApi";
import prettier from "prettier"
import { z } from "zod";

const compiler = async () => {
    let string = "export type APIRoutes = {"
    apiInfo.forEach(({ path, payloadSchema, querySchema }, index, array) => {
        const queryRuntime = getRuntimeType(querySchema)
        const payloadRuntime = getRuntimeType(payloadSchema)
        string += `"${path}": {
            query: ${computeTypeString(queryRuntime)}
            payload: ${computeTypeString(payloadRuntime)},
        },`
    })
    string += "}"


    const formatted = await prettier.format(string, { parser: "typescript" });
    await Bun.write("./utils/types.ts", formatted)
}

function isKeyOf<Key extends PropertyKey>(object: Record<Key, any>, key: PropertyKey): key is Key {
    return typeof object === "object" && key in object;
}
const IS_OPTIONAL = "_IS_OPTIONAL_"
const IS_NULLABLE = "_IS_NULLABLE_"
const IS_ARRAY = "_isArray_"
const IS_TUPLE = "_isTuple_"
const IS_UNION = "_isUnion_"
const IS_RECORD = "_isRecord_"
const IS_INTERSECTION = "_isIntersection_"
const IS_PROMISE = "_isPromise_"
const IS_FUNCTION = "_isFunction_"
const IS_MAP = "_isMap_"
const IS_SET = "_isSet_"
const IS_INSTANCE_OF = "_IS_INSTANCE_OF_"
function computeTypeString(object: Record<any, any> | string): string {
    if (typeof object === "string") {
        return object
    }
    if (isKeyOf(object, IS_ARRAY)) {
        object = object[IS_ARRAY] as Record<any, any> | string
        return computeTypeString(object) + "[]"
    }

    if (isKeyOf(object, IS_PROMISE)) {
        object = object[IS_PROMISE]
        return `Promise<${computeTypeString(object)}>`
    }

    if (isKeyOf(object, IS_UNION)) {
        object = object[IS_UNION] as Record<any, any>
        return `(${object.map(computeTypeString).join(" | ")})`
    }

    if (isKeyOf(object, IS_INTERSECTION)) {
        object = object[IS_INTERSECTION] as { left: any, right: any }
        return `(${computeTypeString(object.left)} & ${computeTypeString(object.right)})`
    }

    if (isKeyOf(object, IS_FUNCTION)) {
        object = object[IS_FUNCTION] as { args: { [IS_TUPLE]: any[] }, return: any }
        const args = computeTypeString(object.args), ret = computeTypeString(object.return);
        const argsString = object.args[IS_TUPLE].length > 1 ? `...args: ${args}` : object.args[IS_TUPLE].length == 1 ? `arg: ${args.slice(1, -1)}` : ""
        return `((${argsString}) => ${ret})`
    }
    if (object[IS_TUPLE]) {
        object = object[IS_TUPLE]

        return tupleToString(object as any[])
    }

    if (object[IS_RECORD]) {
        object = object[IS_RECORD] as { key: any, value: any }
        return `Record <${computeTypeString(object.key)}, ${computeTypeString(object.value)}> `
    }
    if (object[IS_MAP]) {
        object = object[IS_MAP] as { key: any, value: any }
        return `Map<${computeTypeString(object.key)}, ${computeTypeString(object.value)}> `
    }
    if (object[IS_SET]) {
        object = object[IS_SET] as any
        return `Set<${computeTypeString(object)}> `
    }

    if (object[IS_NULLABLE]) {
        object = object[IS_NULLABLE] as Record<any, any> | string
        if (typeof object === "string") return `(${object} | null)`
        return `(${computeTypeString(object)} | null)`
    }
    if (object[IS_OPTIONAL]) {
        object = object[IS_OPTIONAL] as Record<any, any> | string
        if (typeof object === "string") return `(${object} | undefined)`
        return `(${computeTypeString(object)} | undefined)`
    }

    Object.entries(object).forEach(([key, value]) => {
        const isNullable = isKeyOf(value, IS_NULLABLE)
        if (isNullable) {
            // make sure .optional().nullable() ~~ .nullable().optional()
            delete object[key]
            value = value[IS_NULLABLE]
        }
        if (isKeyOf(value, IS_OPTIONAL)) {
            delete object[key]
            value = value[IS_OPTIONAL]
            key += "?"
            object[key] = computeTypeString(value) + (isNullable ? " | null" : "")
        }
        if (isKeyOf(value, IS_ARRAY)) {
            object[key] = computeTypeString(value[IS_ARRAY]) + "[]" + (isNullable ? " | null" : "")
        }
        object[key] = computeTypeString(value) + (isNullable ? " | null" : "")
    })

    return `${objectToString(object)} `
}

function tupleToString(tuple: any[]) {
    return `[${tuple.map(computeTypeString).join(",")}]`
}

function objectToString(object: Record<any, any>) {
    let string = ""
    Object.entries(object).forEach(([key, value]) => {
        string += `${key}: ${value}, \n`
    })
    return `{${string} } `
}

const JavaScriptWrapperObjects = {
    "String": "string", "Number": "number", "Boolean": "boolean", "Symbol": "symbol", "BigInt": "bigint", "Object": "object", "Function": "function", "NaN": "typeof NaN", "Null": "null", "Undefined": "undefined", "Any": "any", "Unknown": "unknown", "Never": "never", "Void": "void"
}

function toPrimitive(type: string) {
    if (isKeyOf(JavaScriptWrapperObjects, type)) return JavaScriptWrapperObjects[type]
    return type
}

// deep type infer of a z.ZodObject
function getRuntimeType(schema: z.ZodTypeAny): Record<string, any> | string {
    switch (true) {
        case schema instanceof z.ZodObject:
            return Object.keys(schema.shape).reduce((acc, key) => {
                const field = schema.shape[key];
                acc[key] = getRuntimeType(field);
                return acc;
            }, {} as Record<string, any>)
        case schema instanceof z.ZodArray:
            const elementType = getRuntimeType(schema._def.type);
            return { [IS_ARRAY]: elementType }
        case (schema instanceof z.ZodTuple):
            return { [IS_TUPLE]: schema._def.items.map(getRuntimeType) }
        case (schema instanceof z.ZodPromise):
            return { [IS_PROMISE]: getRuntimeType(schema._def.type) }
        case (schema instanceof z.ZodUnion):
            return { [IS_UNION]: schema._def.options.map(getRuntimeType) }
        case (schema instanceof z.ZodIntersection):
            return { [IS_INTERSECTION]: { left: getRuntimeType(schema._def.left), right: getRuntimeType(schema._def.right) } }
        case (schema instanceof z.ZodRecord):
            return { [IS_RECORD]: { key: getRuntimeType(schema._def.keyType), value: getRuntimeType(schema._def.valueType) } }
        case (schema instanceof z.ZodNullable):
            return { [IS_NULLABLE]: getRuntimeType(schema._def.innerType) }
        case (schema instanceof z.ZodOptional):
            return { [IS_OPTIONAL]: getRuntimeType(schema._def.innerType) }
        case (schema instanceof z.ZodMap):
            return { [IS_MAP]: { key: getRuntimeType(schema._def.keyType), value: getRuntimeType(schema._def.valueType) } }
        case (schema instanceof z.ZodSet):
            return { [IS_SET]: getRuntimeType(schema._def.valueType) }
        case (schema instanceof z.ZodEffects):
            throw "Does not handle z.instanceOf"
        case (schema instanceof z.ZodFunction):
            return {
                [IS_FUNCTION]: { args: getRuntimeType(schema._def.args), return: getRuntimeType(schema._def.returns) }
            }
        case (schema instanceof z.ZodLiteral):
            return `${JSON.stringify(schema._def.value)} `;
        default:
            return toPrimitive(schema._def.typeName.replaceAll("Zod", ""))

    }
}

export { compiler }
export { getRuntimeType, computeTypeString };
