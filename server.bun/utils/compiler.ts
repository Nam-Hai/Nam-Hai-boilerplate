import { apiInfo } from "./createServerApi";
import path from "path";
import { watch } from "fs";
import { z } from "zod";

const compiler = async () => {

    const root = Bun.main.substring(0, Bun.main.length - path.basename(Bun.main).length)
    watch(
        root,
        { recursive: true },
        (event, filename) => {
            if (filename?.includes("utils")) return
            console.log(filename);
            if (filename === "api/index.ts") compileType()
        },
    );


    async function compileType() {
        const file = Bun.file("./api/index.ts");
        // const text = await file.text();

        let string = ""
        apiInfo.forEach(({ path, outputType }) => {
            string += `"${path}": ${checkObject(outputType)},\n`
        })
        Bun.write("./utils/types.ts", `export type APIRoutes = {
            ${string}
}`)
    }

    compileType()

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
        return schema._def.typeName.replaceAll("Zod", "").toLowerCase();
    }
}

export { compiler }