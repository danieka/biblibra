import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import { apolloClient } from './graphql'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { router } from './routes'

let app = createApp(App)

app.provide(DefaultApolloClient, apolloClient)
app.use(router)
app.mount('#app')
