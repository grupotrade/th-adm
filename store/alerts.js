export const state = () =>  ({
  version: 1,
  text: null,
  color: null,
  border: null,
  type: null,
  colored_border: false,
  dense: false,
  dark: false,
  timeout: 0
})

export const mutations = {
  show(state, payload) {
    state.text = payload.text
    state.color = payload.color
    state.timeout = payload.timeout
    state.dark = payload.dark
    state.dense = payload.dense
    state.colored_border = payload.colored_border
    state.border = payload.border
    state.type= payload.type
  }
}
