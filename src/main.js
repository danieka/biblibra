import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import { apolloClient } from './graphql'
import { allBooks } from './graphql/books.ts'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { router } from './routes'

let app = createApp(App)

apolloClient
    .query({
        query: allBooks,
    })
    .then(data => console.log(data))
    .catch(error => console.error(error))

app.provide(DefaultApolloClient, apolloClient)
app.use(router)
app.mount('#app')
