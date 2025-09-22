interface WebView2 {
    addEventListener: (
        message: 'message',
        handler: (event: { data: any }) => void, // not sure yet what the event type should be
    ) => void;
    postMessage: (message: any) => void;
}
const webview: WebView2 | undefined = import.meta.client ? (window as any).chrome?.webview : undefined
const nativeLowLevelAPIMessager = webview?.postMessage as <T extends API<string>>(api: T) => void
interface API<APIName extends string> {
    $api: APIName
}
const isNativeAvaliable = nativeLowLevelAPIMessager !== undefined
type UUID = ReturnType<typeof crypto.randomUUID>
const _nativeCalls: { [key in UUID]: [(value: any | PromiseLike<any>) => void, (reason?: any) => void] } = {}
function nativeCall<T>($api: string, args: any): Promise<T> {
    if (!import.meta.client) {
        return Promise.reject('Native API cannot be called on server.')
    }
    if (!Native.isAvaliable) {
        return Promise.reject('Native API is not avaliable.')
    }
    let $request = crypto.randomUUID()
    nativeLowLevelAPIMessager({
        $api,
        $request,
        ...args
    });
    return new Promise((resolve, reject) => {
        _nativeCalls[$request] = [resolve, reject]
    })
}
function nativeCallNoResult($api: string, args: any) {
    if (!import.meta.client) {
        return Promise.reject('Native API cannot be called on server.')
    }
    if (!Native.isAvaliable) {
        return Promise.reject('Native API is not avaliable.')
    }
    let $request = crypto.randomUUID()
    nativeLowLevelAPIMessager({
        $api,
        $request,
        ...args
    });
}
if (isNativeAvaliable) {
    webview?.addEventListener('message', ev => {
        if ('$request' in ev.data) {
            let req = _nativeCalls[ev.data.$request]
            if (req === undefined) {
                console.log("Unknown request %o for native message %o", ev.data.$request, ev.data)
            } else {
                const [resolve, reject] = req
                if ('error' in ev.data) {
                    reject(ev.data.error)
                } else if ('result' in ev.data) {
                    resolve(ev.data.result)
                }
            }
        } else {
            console.log("Unknown native message %o", ev.data)
        }
    })
}

const TitleBar = {
    setDragRegion(dragregion: [number, number, number, number][], passthrough: [number, number, number, number][]) {
        nativeCallNoResult("titlebar.setDragRegion", { dragregion, passthrough });
    }
} as const

const Features = {
    async isAvaliable(feature : string) {
        try {
            return await nativeCall('features.isAvaliable', { feature })
        } catch {
            return false
        }
    }
} as const
const FileSystem = {
    get isAvaliable() {
        return isNativeAvaliable
    },
    setDragRegion(dragregion: [number, number, number, number][], passthrough: [number, number, number, number][]) {
        nativeCallNoResult("titlebar.setDragRegion", { dragregion, passthrough });
    }
} as const
export const Native = {
    isAvaliable: isNativeAvaliable,
    nativeCallNoResult,
    nativeCall,
    TitleBar
} as const