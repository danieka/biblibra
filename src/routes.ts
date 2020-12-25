import Home from './views/Home.vue'
import CreateBook from './views/CreateBook.vue'
import ViewBook from './views/ViewBook.vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export let routes: RouteRecordRaw[] = [
    { path: '/', component: Home },
    {
        path: '/books/create',
        component: CreateBook,
    },
    {
        path: '/books/:id',
        component: ViewBook,
        props: route => ({ id: parseInt(route.params.id as string) }),
    },
]

const hot: any = (import.meta as any).hot

export const router = createRouter({
    history: createWebHistory(),
    routes: hot ? [] : routes,
})

if (hot) {
    let removeRoutes: any[] = []

    for (let route of routes) {
        removeRoutes.push(router.addRoute(route))
    }

    hot.acceptDeps('./routes.ts', ({ routes }: { routes: any }) => {
        for (let removeRoute of removeRoutes) removeRoute()
        removeRoutes = []
        for (let route of routes) {
            removeRoutes.push(router.addRoute(route))
        }
        router.replace('')
    })
}
