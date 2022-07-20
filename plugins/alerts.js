export default ({ app, store }, inject) => {
    inject('alert', {
        show({ text = '', type = '', color = '', border = false, dark = false, colored_border = false, dense = false, timeout = 2000 }) {
            store.commit('alerts/show', { text, type, color, border, dark, colored_border, dense, timeout })
        }
    })
}