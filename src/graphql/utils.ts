schema.__schema.types.find(t => t.name === name)
import schema from '../../schema.json'

export interface Type {
    kind: string
    name: string | null
    ofType: Type | null
}

export interface Field {
    name: string
    type: Type
}

interface Model {
    fields: Field[]
}

export function assert(condition: boolean): asserts condition {
    if (!condition) {
        throw new Error('Assertion error')
    }
}

export function findModel(name: string): Model {
    const model = schema.__schema.types.find(t => t.name === name)
    assert(!!model)
    return model as Model
}
