function ensureClient() {
    if (!import.meta.client) {
        throw createError({ status: 500, statusText: 'API should only be called in client' })
    }
}
function hasSimplyToolsAppAPI() {
    
}
function createFileRequest(app: string) {
    ensureClient()

}
function readFileRequest(app: string) {
    ensureClient()

}