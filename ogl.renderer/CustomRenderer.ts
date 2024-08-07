import { createRenderer, defineComponent, type DefineComponent, type RendererOptions, type VNode, type VNodeProps, type VNodeRef } from "vue";
import { useOGL, type OGLContext } from "./useOGL";
import { Geometry, Mesh, Program, Transform, type MeshOptions, type ProgramOptions } from "ogl";


type ConstructorRepresentation = new (...args: any[]) => any
interface VueProps<P> {
    children?: VNode<P>[]
    ref?: VNodeRef
    slot?: string
    key?: string | number | symbol
}

interface CustomCatalogue {
    [name: string]: ConstructorRepresentation
}


type ElementProps<T extends ConstructorRepresentation, P = InstanceType<T>> = Partial<VueProps<P>>
export type OGLComponents = {
    // OGLMesh: DefineComponent<{program: OGL.Program, geometry: OGL.Geometry } & ElementProps<typeof OGL.Mesh>>
    OGLMesh: DefineComponent<Partial<MeshOptions> & ElementProps<typeof Program>>
    OGLProgram: DefineComponent<Partial<ProgramOptions>>
    // OGLTransform: DefineComponent<OGLProps<typeof OGL.Transform>>
    OGLTransform: DefineComponent<ElementProps<typeof Transform>>
}


const catalogue: CustomCatalogue = { OGLMesh: Mesh, OGLProgram: Program, OGLGeometry: Geometry, OGLTransform: Transform }

function noop(fn: string): any {
    console.log(fn);
    fn
}
const VPropsKey = ["key", "ref", "ref_for", "ref_key", "onVnodeBeforeMount", "onVnodeMounted", "onVnodeUpdated", "onVnodeBeforeUnmount", "onVnodeUnmounted"]
export const nodeOps = (context: OGLContext): RendererOptions<Transform, Transform> => {
    const { gl } = context

    return {
        createElement(tag, namespace, isCustomizedBuiltIn, props) {
            if (tag === 'template') return null
            if (!props) { props = {} }
            let instance;
            if (catalogue[tag]) {
                const target = catalogue[tag]

                function omit<D = { [key: string]: any }, T = VNodeProps & D>(obj: T, keysToOmit: string[] = VPropsKey): D {
                    return Object.fromEntries(
                        Object.entries(obj as any).filter(([key]) => !keysToOmit.includes(key))
                    ) as D;
                }

                const oglProps = omit(props)
                if (target === Transform) {
                    instance = new target(oglProps)
                } else {
                    instance = new target(gl, oglProps)
                }
            } else {
                // TODO Primitives ?

            }
            return instance
        },
        insert(el, parent, anchor) {
            if (!el) { return }

            if (el.setParent && !!parent) {
                el.setParent(parent)
            }

            return
        },
        remove(el) {
            el.setParent(null)
        },
        patchProp(el, key, prevValue, nextValue, namespace, parentComponent) {
            // console.error("patchProp", el, key, prevValue, nextValue, namespace, parentComponent);
        },
        parentNode(node) {
            return node?.parent || null
        },
        createText: (text: string) => {
            return noop("createText")
        },
        createComment: (text) => {
            return noop("createComment")
        },

        setText: () => {
            return noop("setText")
        },
        setElementText: () => {
            console.log('setElementText')
            return noop("setElementText")
        },
        nextSibling: () => {
            // console.log('nextSibling')
            return noop("nextSibling")
        },
        querySelector: () => {
            // console.log('querySelector')
            return noop("querySelector")
        },
        setScopeId: () => {
            // console.log('setScopeId')
            return noop("setScropId")
        },
        cloneNode: (node) => {
            console.log('cloneNode', node)
            return noop("cloneNode")
        },
        insertStaticContent: () => {
            // console.log('insertStaticContent') as any
            return noop("insertStaticContent")
        }
    }
}

function createRetargetingProxy<T extends Record<string | number | symbol, any>, K extends keyof T & string & symbol>(
    target: T,
    getters = {} as Record<string | number | symbol, (t: T) => unknown>,
    setters = {} as Partial<Record<K, (val: T[K], t: T, proxy: T, setTarget: (newTarget: T) => void) => boolean>>,
) {
    let _target = target

    const setTarget = (newTarget: T) => {
        _target = newTarget
    }

    let proxy = new Proxy({}, {}) as T

    const handler: ProxyHandler<any> = {
        has(_: any, key: string | number | symbol) {
            return (key in getters) || (key in _target)
        },
        get(_: any, prop: keyof T, __: any) {
            if (prop in getters) {
                return getters[prop](_target)
            }
            return _target[prop]
        },
        set(_: any, prop: K, val: T[K]) {
            if (setters[prop]) {
                setters[prop](val, _target, proxy, setTarget)
            }
            else {
                _target[prop] = val
            }
            return true
        },
    }

    proxy = new Proxy({}, handler) as T

    return proxy
}

