export default ({ app, store }, inject) => {
    inject('dialog', {
        show({ title = '', text = '', buttons = [], hidecancel }) {
            store.commit('dialogs/show', { title, text, buttons, hidecancel })
        },
        hide() {
            store.commit('dialogs/hide')
        }
    })
}