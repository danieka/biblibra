<script lang="ts">
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import { allBooks, bookByPk, updateBookByPkMutation } from '../graphql/books'
import { defineComponent, Ref, ref } from 'vue'
import BookForm from '../components/BookForm.vue'
import AppBar from '../components/AppBar.vue'
import { assert, findModel } from '../graphql/utils'
import { Book } from './Home.vue'
import { pickBy, uniqBy } from 'lodash'

export default defineComponent({
    components: { BookForm, AppBar },
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        const { result } = useQuery(bookByPk, () => ({
            id: props.id,
        }))
        const book = useResult<any, null, Book>(result, null, data => data.books_by_pk)

        const form: Ref<null | typeof BookForm> = ref(null)

        const { mutate: updateBookByPk } = useMutation(updateBookByPkMutation, () => ({
            update: (cache, { data: { update_books_by_pk } }) => {
                assert(update_books_by_pk.id)
                const data = cache.readQuery<{ books: Book[] }>({
                    query: allBooks,
                }) || { books: [] }
                cache.writeQuery({
                    query: allBooks,
                    data: { books: uniqBy([...data.books, update_books_by_pk], b => b.id) },
                })
            },
        }))

        return {
            book,
            form,
            updateBookByPk,
        }
    },
    data: () => ({
        edit: false,
        valid: true,
        formData: {},
    }),
    methods: {
        cancel() {
            this.edit = false
            assert(!!this.form)
            this.form.cancel()
        },
        async save() {
            assert(!!this.book)
            this.updateBookByPk({
                id: this.book.id,
                object: pickBy(this.formData, (value, key) => findModel('books').fields.find(f => f.name === key)),
            })
            this.edit = false
        },
    },
})
</script>
<template>
    <app-bar v-if="book">
        {{ book.title }}
        <template #button>
            <button v-if="!edit" class="text-blue-400" @click="edit = true">Edit</button>
        </template>
    </app-bar>
    <div class="p-2">
        <book-form
            v-if="book"
            ref="form"
            v-model:valid="valid"
            :model-value="book"
            :readonly="!edit"
            @update:model-value="formData = $event"
        ></book-form>
        <div v-if="edit" class="flex flex-row justify-center space-x-6 mt-4">
            <button class="button bg-gray-100 hover:bg-gray-200" @click="cancel">Cancel</button>
            <button
                class="button text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                :disabled="!valid"
                @click="save"
            >
                Save
            </button>
        </div>
    </div>
</template>
