const accepted = import.meta.client ? ref(localStorage.getItem('aiPolicyAccepted') === 'true') : ref(false)
export function useAIPolicyStatus() {

    function accept() {
        localStorage.setItem('aiPolicyAccepted', 'true')
        accepted.value = true
    }
    return { accepted, accept }
}