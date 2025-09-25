import type { ShallowRef } from "vue"
import type { Page, PageInfo } from "./pages/_helper"
import { Categories } from "./pages/info"
import { Uncategorized } from "./pages/uncategorized"
import { Apps, type AppPage } from "./pages/app"

const currentPage = shallowRef<PageInfo | undefined>(undefined)
const pageInfo = computed(() => {
    if (!currentPage.value) {
        return {
            breadcrumb: [],
            appName: 'SimplyTools',
            toolName: 'Home',
            category: Uncategorized,
            catPath: Uncategorized.path,
            toolPath: '/',
            isApp: false
        }
    } else {
        let toolName = currentPage.value.inPageTitle ?? currentPage.value.title
        let appName
        let breadcrumb
        let isApp = false
        if (currentPage.value.parent === Apps) {
            appName = (currentPage.value as AppPage).appName
            breadcrumb = [appName, toolName] as [string, string | Ref<string>]
            isApp = true
        }
        else if (currentPage.value.parent !== Uncategorized) {
            appName = currentPage.value.parent.name
            breadcrumb = [currentPage.value.parent.shortName, toolName] as [string, string | Ref<string>]
        } else {
            appName = 'SimplyTools'
            breadcrumb = [toolName]
        }
        return {
            breadcrumb,
            appName: appName,
            toolName,
            category: currentPage.value.parent,
            catPath: currentPage.value.parent.path,
            toolPath: `${currentPage.value.parent.path}/${currentPage.value.path}`,
            isApp
        }
    }
})

export function setPageInfo(page?: PageInfo) {
    currentPage.value = page
    return pageInfo
}
export function useCurrentPage() {
    return currentPage
}
export function usePageInfo(page?: PageInfo) {
    // let currentPage
    // if (page) {
    //     currentPage = shallowRef(page)
    //     provide('metadata.page', currentPage)
    // } else {
    //     currentPage = inject<ShallowRef<Page> | undefined>('metadata.page', undefined)
    //     if (currentPage === undefined) {
    //         currentPage = ref(undefined)
    //     }
    // }
    // const currentPage = currentPage
    if (page) {
        currentPage.value = page
    }
    return pageInfo
}
// export function usePageInfo() {
//     const routes = useRoute()
//     const paths = computed(() => {
//         let paths = routes.path.slice(1).split('/')
//         if (paths[0] === 'SimplyTools') {
//             paths.splice(0, 1)
//         }
//         let out = []
//         if (paths.length === 0 || (paths.length === 1 && paths[0] === '')) {
//             return []
//         }
//         if (paths.length === 1) {
//             return [Uncategorized.pages.find(x => x.path === paths[0])?.title ?? paths[0]!]
//         }
//         if (paths.length === 2) {
//             let cat = Categories[paths[0]! as keyof typeof Categories]
//             let first = cat?.pages.find(x => x.path === paths[1])
//             return [
//                 cat?.shortName ?? paths[0],
//                 first?.inPageTitle ?? first?.title ?? paths[1]!
//             ]
//         }
//         return paths
//     })
//     return {
//         breadcrumb: paths
//     }
// }