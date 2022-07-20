export const state = () => ({
  version: 1,
  text: null,
  title: null,
  buttons: [],
  hidecancel: false
})

export const mutations = {
  show(state, payload) {
    state.text = payload.text
    state.title = payload.title
    state.buttons = payload.buttons
    state.hidecancel = payload.hidecancel
  },
  hide(state, payload = '') {
    state.text = null
    state.title = null
    state.buttons = null
    state.hidecancel = false
  }
}
