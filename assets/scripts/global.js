import ajax from '@/assets/scripts/ajax'
export const mutations = {
  setData(state, payload) {
    state[payload.key] = payload.value
  },
  setConfig(state, payload) {
    state.seo = payload.seo
    state.siteName = payload.siteName
    state.isConfigEmail = payload.isConfigEmail
    state.isConfigGithub = payload.isConfigGithub
  }
}
export const actions = {
  async getSystemConfig({ commit }) {

  }
}
