import { type } from "arktype"

const user = type({
    name: "string",
    test: type({ a: "number" }),
    platform: "'android' | 'ios'",
    "versions?": "(number | string)[]"
})
// extract the type if needed
type User = typeof user.infer

console.log(JSON.stringify(user))
