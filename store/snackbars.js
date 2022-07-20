export const state = () => ({
  version: 1,
  text: null,
  color: null,
  timeout: 0
})

export const mutations = {
  show(state, payload) {
    state.text = payload.text
    state.color = payload.color
    state.timeout = payload.timeout
  }
}
