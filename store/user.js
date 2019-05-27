import ajax from '@/assets/scripts/ajax'
export const mutations = {
  setData(state, payload) {
    state[payload.key] = payload.value
  }
}
export const actions = {
  async getUser({ commit }) {
    const { data } = await ajax.get('/user')
    commit('setData', {
      key: 'user',
      value: data
    })
  },
  async getOtherUser({ commit }, id) {
    const { data } = await ajax.get(`/user-base/${id}`)
    commit('setData', {
      key: 'otherUser',
      value: data
    })
  },
  async getUsers({ commit }) {
    const { data } = await ajax.get('/users')
    commit('setData', {
      key: 'uses',
      value: data
    })
  },
  async login({ commit, dispatch }, body) {
    const { success } = await ajax.post('/login', body)
    if (success) {
      await dispatch('getUser')
    }
  },
  async logout({ commit }) {
    await ajax.post('/logout')
    commit('setData', {
      key: 'user',
      value: {}
    })
  },
  async register({ commit }, data) {
    return await ajax.post('/user', data)
  },
  async patchUser({ commit }, user) {
    return await ajax.patch('/user', user)
  },
  async patchPassword({ commit }, body) {
    await ajax.patch('/user/password', body)
    commit('setData', {
      key: 'user',
      value: {}
    })
  }
}
export const state = () => ({
  user: {},
  users: [],
  otherUser: {}
})
