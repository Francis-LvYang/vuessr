const globalConfig = require('./server/config/global.config')

// 全局域名赋值
process.env.DOMAIN = globalConfig.app.domain

module.exports = {
  mode: 'universal',
  head: {
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        name: 'renderer',
        content: 'webkit'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'RSS 2.0',
        href: '/rss.xml'
      }
    ]
  },
  loading: {
    color: '#64B868'
  },
  css: ['~/assets/styles/min.less'],
  plugins: [
    {
      src: '~/plugins/iview',
      ssr: true
    },
    {
      src: '~/plugins/components',
      ssr: true
    },
    {
      ssc: '~/plugins/filters',
      ssr: true
    }
  ],
  modules: [
    '@nuxtjs/pwa',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-125551361-1'
      }
    ]
  ],
  build: {
    /*
     ** You can extend webpack config here
     */
    loaders: {
      less: {
        javascriptEnabled: true
      }
    },
    extend(config, ctx) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.vue$/,
        loader: 'iview-loader',
        options: {
          prefix: true
        },
        exclude: /(node_modules)/
      })
      //  Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rule.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  manifest: {
    name: 'Auther Lyu',
    short_name: 'Auther',
    display: 'standalone',
    background_color: '#f3f3f3',
    theme_color: '#64B888',
    description: 'A blog system'
  }
}
