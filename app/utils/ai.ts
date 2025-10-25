const globalAccepted = (async () => {
    if (import.meta.client)
        return ref(await Native.KeyValueStorage.getAsync<boolean>('aiPolicyAccepted'))
    else
        return ref(false)
})()

export async function useAIPolicyStatusAsync() {
    const accepted = await globalAccepted
    async function acceptAsync() {
        await Native.KeyValueStorage.setAsync('aiPolicyAccepted', true)
        accepted.value = true
    }
    return { accepted, acceptAsync }
}