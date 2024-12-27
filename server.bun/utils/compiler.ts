import vueLenisPlugin from "lenis/vue";
import { apiInfo } from "./createServerApi";
import prettier from "prettier"
import { object, z, ZodIntersection } from "zod";

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

const IS_OPTIONAL = "_IS_OPTIONAL_"
const IS_NULLABLE = "_IS_NULLABLE_"
const IS_ARRAY = "_isArray_"
const IS_TUPLE = "_isTuple_"
const IS_UNION = "_isUnion_"
const IS_INTERSECTION = "_isIntersection_"
function computeTypeString(object: Record<any, any> | string): string {
    if (typeof object === "string") {
        return object
    }
    if (isKeyOf(object, IS_ARRAY)) {
        object = object[IS_ARRAY] as Record<any, any> | string
        // if (typeof object === "string") {
        //     return object + isArray
        // }
        return computeTypeString(object) + "[]"
    }


    if (isKeyOf(object, IS_UNION)) {
        object = object[IS_UNION] as Record<any, any>

        return `(${object.map(computeTypeString).join(" | ")})`
    }

    if (object[IS_TUPLE]) {
        object = object[IS_TUPLE]
        return tupleToString(object as any[])
    }

    if (object[IS_NULLABLE]) {
        object = object[IS_NULLABLE] as Record<any, any> | string
        if (typeof object === "string") return `(${object} | null)`
        return `(${computeTypeString(object)} | null)`
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
        if (typeof value === "object") object[key] = computeTypeString(value)
    })


    return `${objectToString(object)}`
}

function tupleToString(tuple: any[]) {
    return `[${tuple.map(computeTypeString).join(",")}]`
}

function objectToString(object: Record<any, any>) {
    let string = ""
    Object.entries(object).forEach(([key, value]) => {
        string += `${key}: ${value},\n`
    })
    return `{${string}}`
}

const JavaScriptWrapperObjects = {
    "String": "string", "Number": "number", "Boolean": "boolean", "Symbol": "symbol", "BigInt": "bigint", "Object": "object", "Function": "function", "NaN": "typeof NaN", "Null": "null", "Undefined": "undefined"
}
function isKeyOf<Key extends PropertyKey>(object: Record<Key, any>, key: PropertyKey): key is Key {
    return typeof object === "object" && key in object;
}

function toPrimitive(type: string) {
    if (isKeyOf(JavaScriptWrapperObjects, type)) return JavaScriptWrapperObjects[type]
    return type
}

// deep type infer of a z.ZodObject
function getRuntimeType(schema: z.ZodTypeAny): Record<string, any> | string {
    if (schema instanceof z.ZodObject) {
        return Object.keys(schema.shape).reduce((acc, key) => {
            const field = schema.shape[key];
            acc[key] = getRuntimeType(field);
            return acc;
        }, {} as Record<string, any>)
    } else if (schema instanceof z.ZodArray) {
        const elementType = getRuntimeType(schema._def.type);
        return { [IS_ARRAY]: elementType }
    } else if (schema instanceof z.ZodLiteral) {
        return `${JSON.stringify(schema._def.value)}`;

    } else if (schema instanceof z.ZodTuple) {
        const runtimeType = schema._def.items.map(getRuntimeType)
        return { [IS_TUPLE]: runtimeType }
    } else if (schema instanceof z.ZodUnion) {
        // throw "no UnionType in endpoint"
        const type = schema._def.options.map(getRuntimeType);
        return {
            [IS_UNION]: type
        }
    } else if (schema instanceof z.ZodIntersection) {
        throw "no Intersection in endpoint"
        // Attention
        // const type = schema._def.options.map(getRuntimeType);
        // const s = schema as ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>
        // let left = getRuntimeType(s._def.left), right = getRuntimeType(s._def.right)
        // function toObject(obj: Record<string, any> | string): Record<string, any> {
        //     return typeof obj === "string" ? [obj] : obj
        // }
        // const record: Record<string, any> = [...Object.values(toObject(left)), ...Object.values(toObject(right))]
        // record[IS_INTERSECTION] = true
        // console.log(record);
        // return record
    } else if (schema instanceof z.ZodNullable) {
        const runtimeType = getRuntimeType(schema._def.innerType)
        return { [IS_NULLABLE]: runtimeType }
    } else if (schema instanceof z.ZodOptional) {
        const runtimeType = getRuntimeType(schema._def.innerType)
        return { [IS_OPTIONAL]: runtimeType }
    } else {
        const type = schema._def.typeName.replaceAll("Zod", "");
        return toPrimitive(type)
    }
}

export { compiler }
export { getRuntimeType, computeTypeString };