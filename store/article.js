// import ajax from '@/assets/scripts/ajax'

//
// export const mutations = {
//   setArticles(state, { data, total }) {
//     data.forEach(i => {
//       state.articles.push(i)
//     })
//     state.total = total
//   },
//   setData(state, paylaod) {
//     state[paylaod.key] = paylaod.value
//   },
//   setComment(state, data) {
//     state.article.comments.push(data)
//   },
//   setArticlesNull(state) {
//     state.articles = []
//     state.total = 0
//   },
//   setArticlesTopNull(state) {
//     state.articlesTop = []
//   }
// }
//
// export const actions = {
//   async getArticles({ state, commit }, params) {
//     // const ret = await ajax.get('/articles', {
//     //   params: {
//     //     limit: state.limit,
//     //     ...params
//     //   }
//     // })
//   }
// }
//
// export const state = () => ({
//   articles: [],
//   articlesTop: [],
//   total: 0,
//   limit: 15,
//   article: {}
// })
