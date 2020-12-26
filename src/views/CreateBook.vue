<script lang="ts">
import { useMutation } from '@vue/apollo-composable'
import { defineComponent } from 'vue'
import { addBookMutation, allBooks } from '../graphql/books'
import { pickBy } from 'lodash'

import { assert, findModel } from '../graphql/utils'
import BookForm from '../components/BookForm.vue'
import AppBar from '../components/AppBar.vue'

const fields = findModel('books').fields.filter(f => !['id', 'isbn'].includes(f.name))

export default defineComponent({
    name: 'CreateBook',
    components: { BookForm, AppBar },
    setup() {
        const { mutate: addBook } = useMutation(addBookMutation, () => ({
            update: (cache, { data: { insert_books_one } }) => {
                assert(insert_books_one.id)
                const data = cache.readQuery<Record<string, unknown[]>>({
                    query: allBooks,
                }) || { books: [] }
                cache.writeQuery({
                    query: allBooks,
                    data: { books: [...data.books, insert_books_one] },
                })
            },
        }))

        return {
            fields,
            addBook,
        }
    },
    data: () => ({
        data: {} as Record<string, unknown>,
        valid: false,
    }),

    methods: {
        cancel() {
            this.$router.back()
        },
        async create() {
            this.data.pages = parseInt(this.data.pages as string)
            await this.addBook({
                object: pickBy(this.data, (value, key) => findModel('books').fields.find(f => f.name === key)),
            })
            this.$router.back()
        },
    },
})
</script>
<template>
    <app-bar>Create book</app-bar>
    <div class="p-2">
        <book-form v-model:model-value="data" v-model:valid="valid" ref="bookForm"></book-form>
        <div class="flex flex-row justify-center space-x-6 mt-4">
            <button class="button bg-gray-100 hover:bg-gray-200" @click="cancel">Cancel</button>
            <button
                class="button text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                :disabled="!valid"
                @click="create"
            >
                Create
            </button>
        </div>
    </div>
</template>
<style lang="postcss">
.drawingBuffer {
    display: none;
}
</style>
