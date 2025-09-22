import type { ShallowRef } from "vue"
import type { Page, PageInfo } from "./pages/_helper"
import { Categories } from "./pages/info"
import { Uncategorized } from "./pages/uncategorized"
import { Apps, type AppPage } from "./pages/app"

export function usePageInfo(page?: PageInfo) {
    let pageRef
    if (page) {
        pageRef = shallowRef(page)
        provide('metadata.page', pageRef)
    } else {
        pageRef = inject<ShallowRef<Page> | undefined>('metadata.page', undefined)
        if (pageRef === undefined) {
            pageRef = ref(undefined)
        }
    }
    return computed(() => {
        if (!pageRef.value) {
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
            let toolName = pageRef.value.inPageTitle ?? pageRef.value.title
            let appName
            let breadcrumb
            let isApp = false
            if (pageRef.value.parent === Apps) {
                appName = (pageRef.value as AppPage).appName
                breadcrumb = [appName, toolName] as [string, string | Ref<string>]
                isApp = true
            }
            else if (pageRef.value.parent !== Uncategorized) {
                appName = pageRef.value.parent.name
                breadcrumb = [pageRef.value.parent.shortName, toolName] as [string, string | Ref<string>]
            } else {
                appName = 'SimplyTools'
                breadcrumb = [toolName]
            }
            return {
                breadcrumb,
                appName: appName,
                toolName,
                category: pageRef.value.parent,
                catPath: pageRef.value.parent.path,
                toolPath: `${pageRef.value.parent.path}/${pageRef.value.path}`,
                isApp
            }
        }
    })
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