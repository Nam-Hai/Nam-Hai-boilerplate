import { describe, it, expect } from "bun:test";
import prettier from "prettier"
import { z } from "zod";
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
        "typeof NaN": "nan",
        any: "any",
        unknown: "unknown",
        void: "void",
        never: "never",
        symbol: "symbol",
        bigint: "bigint"
    } as const
    function compilePrimitive(primitive: keyof typeof primitiveToZod) {
        it(`compile ${primitive}`, async () => {
            const schema = z[primitiveToZod[primitive]]()
            const typeString = computeTypeString(getRuntimeType(schema))
            expect(await format(`type A = ${typeString}`)).toBe(await format(`type A = ${primitive}`));
        });
    }
    Object.keys(primitiveToZod).forEach((element) => {
        compilePrimitive(element as keyof typeof primitiveToZod)
    });

    it("compile basic nullish", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.string().nullish()))
        expect(await format(typeString)).toBe(await format("type A = (string | null) | undefined"));
    })
    it("compile basic nullish", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.string().nullish() })))
        expect(await format(typeString)).toBe(await format("type A = {foo?: string | null}"));
    })
});
describe("Optional : ", () => {

    it(`compile optional`, async () => {
        const schema = z.optional(z.string())
        const typeString = "type A = " + computeTypeString(getRuntimeType(schema))
        expect(await format(typeString)).toBe(await format("type A = (string | undefined)"));
    });
    it(`compile optional`, async () => {
        const schema = z.optional(z.null().or(z.number()))
        const typeString = "type A = " + computeTypeString(getRuntimeType(schema))
        expect(await format(typeString)).toBe(await format("type A = ((null | number) | undefined)"));
    });

    it(`compile optional`, async () => {
        const schema = z.object({ foo: z.string().optional() })
        const typeString = "type A = " + computeTypeString(getRuntimeType(schema))
        expect(await format(typeString)).toBe(await format("type A = {foo?: string}"));
    });
    it(`compile optional`, async () => {
        const schema = z.optional(z.array(z.object({ foo: z.string().optional() })))
        const typeString = "type A = " + computeTypeString(getRuntimeType(schema))
        expect(await format(typeString)).toBe(await format("type A = ({foo?: string}[] | undefined)"));
    });
})

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

    it(`compile basic object nullable`, async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.number().nullable(), bar: z.string() })))
        expect(await format(typeString)).toBe(await format("type A = { bar: string, foo: number | null}"));
    })

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

    it("compile basic array optional", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.array(z.number()).optional() })))
        expect(await format(typeString)).toBe(await format("type A = {foo?: number[]}"));
    })

    it("compile union in Array", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.array(z.union([z.number(), z.boolean(), z.nan(), z.null()]))))
        expect(await format(typeString)).toBe(await format("type A = (number | boolean | typeof NaN | null)[]"));
    })


    it("compile array and nullable", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.array(z.number()).nullable() })))
        expect(await format(typeString)).toBe(await format("type A = { foo: number[] | null }"));
    })

    it("compile array and nullable", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.array(z.number()).nullable().optional() })))
        expect(await format(typeString)).toBe(await format("type A = { foo?: number[] | null }"));
    })


    it("compile array and nullable", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.object({ foo: z.array(z.number().nullable().optional()).nullable().optional() })))
        expect(await format(typeString)).toBe(await format("type A = { foo?: ((number | null) | undefined)[] | null }"));
    })
})

describe("Intersection : ", () => {
    it("compile basic intersection", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.intersection(z.boolean(), z.number())))
        expect(await format(typeString)).toBe(await format("type A = (boolean & number)"));
    })
    it("compile basic intersection", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.intersection(z.boolean(), z.number().nullable())))
        expect(await format(typeString)).toBe(await format("type A = (boolean & (number | null))"));
    })

})

describe("Promise : ", () => {
    it("compile basic promise", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.promise(z.void())))
        expect(await format(typeString)).toBe(await format("type A = Promise<void>"));
    })
    it("compile basic promise", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.promise(z.string())))
        expect(await format(typeString)).toBe(await format("type A = Promise<string>"));
    })

    it("compile promise Object", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.promise(z.object({ name: z.string().nullish() }))))
        expect(await format(typeString)).toBe(await format("type A = Promise<{name?: string | null}>"));
    })
})

describe("Function : ", () => {
    it("compile basic function", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.function()))
        expect(await format(typeString)).toBe(await format("type A = (() => unknown)"));
    })

    it("compile basic function", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.function().args().returns(z.void())))
        expect(await format(typeString)).toBe(await format("type A = (() => void)"));
    })

    it("compile basic function", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.function().args(z.number()).returns(z.void())))
        expect(await format(typeString)).toBe(await format("type A = ((arg: number) => void)"));
    })

    it("compile basic function", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.function().args(z.string(), z.number()).returns(z.void())))
        expect(await format(typeString)).toBe(await format("type A = ((...args: [string, number]) => void)"));
    })

    it("compile basic function", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.function().args(z.string(), z.number(), z.object({ name: z.number() })).returns(z.object({ foo: z.boolean().nullish() }))))

        expect(await format(typeString)).toBe(await format("type A = ((...args: [string, number, {name: number}]) => {foo?: boolean | null})"));
    })

    it("compile function, callback", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.function().args(z.function()).returns(z.function().args(z.string()).returns(z.object({ foo: z.boolean() })))))
        expect(await format(typeString)).toBe(await format("type A = ((arg: (() => unknown)) => ((arg: string) => {foo: boolean}))"));
    })

    it("compile function, callback", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.function().args(z.string(), z.string(), z.object({ foo: z.string().optional(), bar: z.boolean().optional() }).optional()).returns(z.void())))

        expect(await format(typeString)).toBe(await format("type A = ((...args: [string, string, {foo?: string, bar?: boolean} | undefined])=> void)"));
    })
})


describe("Map & Set : ", () => {
    it("compile basic Set", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.set(z.string())))
        expect(await format(typeString)).toBe(await format("type A = Set<string>"));
    })
    it("compile basic Set", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.set(z.array(z.string()))))
        expect(await format(typeString)).toBe(await format("type A = Set<string[]>"));
    })
    it("compile basic Set", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.set(z.array(z.string()).or(z.string()))))
        expect(await format(typeString)).toBe(await format("type A = Set<string[] | string>"));
    })

    it("compile basic Map", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.map(z.number(), z.string())))
        expect(await format(typeString)).toBe(await format("type A = Map<number, string>"));
    })
    it("compile basic Map", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.map(z.string(), z.array(z.string()))))
        expect(await format(typeString)).toBe(await format("type A = Map<string, string[]>"));
    })
    it("compile basic Map", async () => {
        const typeString = "type A = " + computeTypeString(getRuntimeType(z.map(z.tuple([z.string(), z.number(), z.boolean()]), z.array(z.string()).or(z.string()))))
        expect(await format(typeString)).toBe(await format("type A = Map<[string, number, boolean], string[] | string>"));
    })
})