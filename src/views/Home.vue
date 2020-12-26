<script lang="ts">
import { useQuery, useResult } from '@vue/apollo-composable'
import AppBar from '../components/AppBar.vue'
import { defineComponent } from 'vue'
import { allBooks } from '../graphql/books'
import { identity, some } from 'lodash'

export interface Book {
    title: string
    isbn: string
    id: number
}

export default defineComponent({
    name: 'Home',
    components: { AppBar },
    setup() {
        const { result } = useQuery(allBooks)

        const books = useResult<any, Book[], Book[]>(result, [], data => data.books)

        return {
            books,
        }
    },
    data: () => ({
        search: '',
    }),
    computed: {
        filteredBooks(): ReadonlyArray<Book> {
            if (this.search.length === 0) {
                return this.books
            }
            const fieldsToSearch: (keyof Book)[] = ['isbn', 'title']
            return this.books.filter(book =>
                some(
                    fieldsToSearch.map(field =>
                        book[field].toString().toLowerCase().includes(this.search.toLowerCase()),
                    ),
                    identity,
                ),
            )
        },
    },
})
</script>
<template>
    <app-bar>Home</app-bar>
    <input v-model="search" placeholder="Search" class="w-full p-2 h-8" />
    <div class="p-2">
        <div class="border border-gray-300 bg-white rounded divide-y">
            <router-link v-for="book in filteredBooks" :key="book.id" :to="`/books/${book.id}`" class="block p-2">
                {{ book.title }}
            </router-link>
        </div>
        <div class="flex mt-4 justify-center">
            <router-link to="/books/create">
                <button class="button text-white bg-blue-600 hover:bg-blue-700">New book</button>
            </router-link>
        </div>
    </div>
</template>
