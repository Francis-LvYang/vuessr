import axios from '@nuxtjs/axios'
import Vue from 'vue'

const isServer = Vue.prototype.$isServer || process.server
const baseURL = isServer
  ? `${process.env.DOMAIN}/api`
  : `${window.location.origin}/api`

const ajax = axios.create({
  baseURL,
  responseType: 'json',
  withCredentials: true
})

ajax.interceptors.response.use(
  response => {
    const { data } = response
    if (data && !isServer && data.success === false) {
      Vue.prototype.$Message.error({
        content: data.message
      })
    }
    return data
  },
  error => Promise.reject(error)
)

export default ajax
