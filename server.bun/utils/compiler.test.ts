import { describe, it, expect } from "bun:test";
import prettier from "prettier"
import { boolean, z } from "zod";
import { computeTypeString, getRuntimeType } from "./compiler";

const format = async (string: string) => {
    return await prettier.format(string, { parser: "typescript" })
}


describe("Primitives : ", () => {
    const primitiveToZod = {
        string: "string",
        number: "number",
        null: "null",
        undefined: "undefined",
        Date: "date",
        boolean: "boolean",
        "typeof NaN": "nan"
    } as const
    function compilePrimitive(primitive: keyof typeof primitiveToZod) {
        it(`compile ${primitive}`, async () => {
            const schema = z[primitiveToZod[primitive]]()
            const typeString = computeTypeString(getRuntimeType(schema))
            expect(await format(typeString)).toBe(await format(primitive));
        });
    }
    Object.keys(primitiveToZod).forEach((element) => {
        compilePrimitive(element as keyof typeof primitiveToZod)
    });
});

describe("Object : ", () => {
    it(`compile empty object`, async () => {
        const typeString = computeTypeString(getRuntimeType(z.object({})))
        expect(await format(typeString)).toBe(await format("{}"));
    });

    it(`compile basic object`, async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.number(), bar: z.string(), fizz: z.boolean() })))
        expect(await format(typeString)).toBe(await format("type A = { foo:number; bar: string; fizz: boolean }"));
    });
    it(`compile basic object optionnal`, async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.number().optional(), bar: z.string(), fizz: z.boolean().optional() })))
        expect(await format(typeString)).toBe(await format("type A = {bar: string, foo?:number,  fizz?: boolean}"));
    });
    it(`compile basic object optionnal, nullable`, async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.number().nullable().optional(), bar: z.undefined(), fizz: z.boolean().optional() })))
        expect(await format(typeString)).toBe(await format("type A = { bar: undefined, foo?:number | null, fizz?: boolean}"));
    });

    it(`compile basic object optionnal, nullable`, async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.number().nullable().optional(), bar: z.number().optional().nullable() })))
        expect(await format(typeString)).toBe(await format("type A = {foo?: number | null, bar?: number | null}"));

    });
    it(`compile basic object optionnal, nullable`, async () => {
        const a = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.number().nullable().optional() })))
        const b = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.number().optional().nullable() })))
        expect(await format(a)).toBe(await format(b));
    })

    it("deep Object", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.number(), bar: z.object({ foo: z.number(), fizz: z.array(z.object({ foo: z.number() })) }) })))
        expect(await format(typeString)).toBe(await format("type A = {foo: number, bar: {foo: number, fizz: {foo: number}[]}}"));
    })
})

describe("Array : ", () => {
    it("compile basic array", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.array(z.boolean())))
        expect(await format(typeString)).toBe(await format("type A = boolean[]"));
    })
    it("compile basic array", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.array(z.number().nullable())))
        expect(await format(typeString)).toBe(await format("type A = (number | null)[]"));
    })

    it("compile basic array", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.array(z.number().or(z.boolean()))))
        expect(await format(typeString)).toBe(await format("type A = (number | boolean)[]"));
    })
    it("compile union in Array", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.array(z.union([z.number(), z.boolean(), z.nan(), z.null()]))))
        expect(await format(typeString)).toBe(await format("type A = (number | boolean | typeof NaN | null)[]"));
    })


    it("compile array and nullable", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.array(z.number()).nullable() })))
        expect(await format(typeString)).toBe(await format("type A = { foo: number[] } | null"));
    })
})