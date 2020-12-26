<script lang="ts">
import { defineComponent } from 'vue'
import { find } from 'lodash'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import { allBooks, getBookDataMutation } from '../graphql/books'
import { assert, findModel } from '../graphql/utils'
import { error } from '../components/Toast.vue'
import ScanIsbn from './ScanIsbn.vue'
import { cloneDeep } from '@apollo/client/utilities'
import Loader from './Loader.vue'
import { form } from './Form'
import { Book } from 'src/views/Home.vue'

const fields = findModel('books').fields.filter(f => !['id', 'isbn', 'cover_image'].includes(f.name))

export default defineComponent({
    name: 'BookForm',
    components: { ScanIsbn, Loader, GeneratedForm: form(fields) },
    props: {
        modelValue: {
            type: Object,
            required: true,
        },
        valid: {
            type: Boolean,
            default: () => false,
        },
        readonly: {
            type: Boolean,
            default: () => false,
        },
    },
    emits: ['update:modelValue', 'update:valid'],
    setup() {
        const { result } = useQuery(allBooks)
        const books = useResult<any, Book[], Book[]>(result, [], data => data.books)

        const humanize = (s: string) => s.replace('_', ' ')
        const { mutate: getBookData, loading } = useMutation(getBookDataMutation)

        return {
            books,
            fields,
            humanize,
            error,
            getBookData,
            loading,
        }
    },
    data: () => ({
        scanning: false,
        data: {} as Readonly<Record<string, unknown>>,
    }),
    computed: {
        isbnDuplicate(): boolean {
            if (!this.data || this.data.isbn === this.modelValue.isbn) {
                return false
            }
            return !!find(this.books, book => book.isbn === this.data.isbn)
        },
        hasScanningCapability(): boolean {
            return !!window.MediaDevices
        },
    },
    watch: {
        isbnDuplicate() {
            this.$emit('update:valid', !this.isbnDuplicate)
        },
        modelValue: {
            immediate: true,
            handler() {
                this.data = cloneDeep(this.modelValue)
            },
        },
    },
    methods: {
        set(field: string, value: InputEvent) {
            assert(!!value.target)
            const target = value.target as HTMLInputElement
            const diff: Record<string, unknown> = {}
            diff[field] = target.value
            this.$emit('update:modelValue', { ...this.data, ...diff })
        },
        cancel() {
            this.data = cloneDeep(this.modelValue)
        },
        async onISBNChange(isbn: string) {
            this.scanning = false
            if (this.readonly) {
                return
            }
            try {
                const res = await this.getBookData({ isbn })
                this.$emit('update:modelValue', { ...this.data, ...res.data.getBookData })
            } catch (e) {
                console.error(e)
                this.error = 'Could not find ISBN'
            }
        },
    },
})
</script>
<template>
    <loader v-if="loading"></loader>
    <template v-if="scanning">
        <scan-isbn @isbn="onISBNChange($event)" @cancel="scanning = false"></scan-isbn>
    </template>
    <template v-else>
        <div class="flex content-center justify-between items-center space-x-4">
            <div class="flex flex-col items-stretch text-left py-1 capitalize flex-grow">
                <label id="isbn">ISBN</label>

                <input
                    :value="data['isbn']"
                    type="number"
                    for="isbn"
                    :readonly="readonly"
                    @input="set('isbn', $event)"
                    @blur="onISBNChange($event.target.value)"
                />
            </div>

            <ion-icon
                v-if="!readonly && hasScanningCapability && !data.id"
                name="camera"
                size="large"
                class="mr-2"
                @click="scanning = true"
            ></ion-icon>
        </div>

        <p v-if="!readonly && isbnDuplicate" class="mt- text-red-500">ISBN has already been added to library</p>
        <generated-form :value="data" :readonly="readonly" @input="$emit('update:modelValue', $event)"></generated-form>
    </template>
</template>
<style lang="postcss" scoped>
input {
    @apply border p-2;
}
</style>
