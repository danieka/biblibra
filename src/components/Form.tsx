import { partial } from 'lodash'
import { assert, Field, Type } from '../graphql/utils'
import { defineComponent, getCurrentInstance } from 'vue'

const humanize = (s: string) => s.replace('_', ' ')

const inputField = (
    type: 'number' | 'text',
    fieldName: string,
    value: string,
    readonly: boolean,
    handler: (e: Event) => void,
) => (
    <div class='flex flex-col items-stretch text-left py-1 capitalize'>
        <label for={fieldName}>{humanize(fieldName)}</label>
        <input class='border p-2' value={value} type={type} id={fieldName} readonly={readonly} onInput={handler} />
    </div>
)

export const textField = partial(inputField, 'text')
export const numberField = partial(inputField, 'number')

const typeMap: Record<string, typeof textField> = {
    String: textField,
    Int: numberField,
}

const inputFieldForType = (type: Type): typeof textField => {
    if (type.ofType) {
        return inputFieldForType(type.ofType)
    }
    assert(!!type.name)

    const field = typeMap[type.name]
    assert(!!field)
    return field
}

export const form = (fields: Field[]) =>
    defineComponent({
        name: 'GraphForm',
        props: {
            value: {
                type: Object,
                required: true,
            },
            readonly: {
                type: Boolean,
                default: () => false,
            },
        },
        emits: ['input'],
        setup(props) {
            const instance = getCurrentInstance()
            assert(!!instance)

            const handler = (fieldName: string, event: Event) => {
                assert(!!event.target)
                const target = event.target as HTMLInputElement
                const diff: Record<string, unknown> = {}
                diff[fieldName] = target.value

                instance.emit('input', { ...props.value, ...diff })
            }

            return () => (
                <div>
                    {fields.map(field =>
                        inputFieldForType(field.type)(
                            field.name,
                            props.value[field.name],
                            props.readonly,
                            partial(handler, field.name),
                        ),
                    )}
                </div>
            )
        },
    })
