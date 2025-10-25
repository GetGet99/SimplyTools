interface WebView2 {
    addEventListener: (
        message: 'message',
        handler: (event: { data: any }) => void, // not sure yet what the event type should be
    ) => void;
    postMessage: (message: any) => void;
}
const webview: WebView2 | undefined = import.meta.client ? (window as any).chrome?.webview : undefined
const nativeLowLevelAPIMessager = webview?.postMessage as <T extends API<NativeFeatures>>(api: T) => void
type NativeFeatures = 'titlebar.setDragRegion' | 'features.isAvaliable' | 'navigation.edge.flags' | 'storage.keyval' | 'storage.keyval.get' | 'storage.keyval.store'
interface API<APIName extends NativeFeatures> {
    $api: APIName
}
const isNativeAvaliable = nativeLowLevelAPIMessager !== undefined
type UUID = ReturnType<typeof crypto.randomUUID>
const _nativeCalls: { [key in UUID]: [(value: any | PromiseLike<any>) => void, (reason?: any) => void] } = {}
function nativeCall<T>($api: NativeFeatures, args: any): Promise<T> {
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
function nativeCallNoResult($api: NativeFeatures, args: any) {
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
                console.warn("Unknown request %o for native message %o", ev.data.$request, ev.data)
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
    async isAvaliable(feature : NativeFeatures) {
        let isAvaliable = this.$avaliableFeatures.get(feature)
        if (isAvaliable !== undefined) {
            return isAvaliable
        }
        try {
            isAvaliable = await nativeCall('features.isAvaliable', { feature }) as boolean
        } catch {
            isAvaliable = false
        }
        this.$avaliableFeatures.set(feature, isAvaliable)
        return isAvaliable
    },
    $avaliableFeatures: new Map<NativeFeatures, boolean>(),
} as const
const FileSystem = {
    isAvaliable() {
        return Promise.resolve(false)
    },
    setDragRegion(dragregion: [number, number, number, number][], passthrough: [number, number, number, number][]) {
        nativeCallNoResult("titlebar.setDragRegion", { dragregion, passthrough });
    }
} as const
const KeyValueStorage = {
    get isAvaliable() {
        return !import.meta.client
    },
    isAvaliableAsNativeAPI() {
        return Features.isAvaliable('storage.keyval')
    },
    async getValueAsStringAsync(key: string) : Promise<string | null> {
        if (await this.isAvaliableAsNativeAPI())
            return nativeCall<string>("storage.keyval.get", { key });
        else
            return localStorage.getItem(key);
    },
    async storeValueAsStringAsync(key: string, value: string) : Promise<void> {
        if (await this.isAvaliableAsNativeAPI())
            return nativeCall<void>("storage.keyval.store", { key, value });
        else
            localStorage.setItem(key, value);
    },
    async getValueAsync<T>(key: string) : Promise<T | null> {
        if (await this.isAvaliableAsNativeAPI())
            return nativeCall<T>("storage.keyval.get", { key });
        else
            return JSON.parse(localStorage.getItem(key) ?? 'null') as T | null;
    },
    async storeValueAsync<T>(key: string, value: T) : Promise<void> {
        if (await this.isAvaliableAsNativeAPI())
            return nativeCall<void>("storage.keyval.store", { key, value });
        else
            localStorage.setItem(key, JSON.stringify(value));
    }
} as const
export const Native = {
    isAvaliable: isNativeAvaliable,
    nativeCallNoResult,
    nativeCall,
    TitleBar
} as const