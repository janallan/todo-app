export default {
    toggle(state, message = '') {
        state.snackbar = !state.snackbar
        state.message = message
    }
}
