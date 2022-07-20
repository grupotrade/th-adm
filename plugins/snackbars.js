export default ({ app, store }, inject) => {
    inject('snackbar', {
        show({ text = '', color = '', timeout = 3000 }) {
            store.commit('snackbars/show', { text, color, timeout })
        }
    })
}