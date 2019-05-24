const isPro = process.env.NODE_ENV === 'production'

module.exports = {
  mongodb: {
    host: '127.0.0.1',
    database: 'auther',
    port: 27017,
    user: '',
    pass: ''
  },
  app: {
    domain: isPro ? 'https://www.leiyongguo.com' : 'http://127.0.0.1:3025',
    siteName: 'AutherSSR'
  },
  admin: {
    user: 'admin',
    pass: '123456',
    email: 'qq22337383@gmail.com'
  },
  jwt: {
    expiresIn: 1 * 600,
    secret: 'auther@123',
    algorithm: 'RS256'
  },
  seo: {
    title: 'Auther-简约而不简单的博客系统',
    keywords: 'Auther，JavaScript博客系统，NodeJS博客系统',
    description:
      'Auther，基于JavaScript构建的前后端同构博客系统，遵循简约而不简单的设计哲学，让每个人都可以方便的记录自己的生活，记录自己的人生'
  },
  email: {
    host: 'smtp.qq.com',
    user: '3478181650@qq.com',
    pass: ''
  },
  github: {
    id: '',
    secret: '',
    scope: 'user'
  },
  pm2: {
    host: '116.196.17.78',
    repo: 'git@github.com:Francis-LvYang/vuessr.git',
    path: '/root/blog'
  }
}
