const mongoose = require('mongoose')
const _ = require('lodash')

const Article = mongoose.model('Article')

exports.getArticles = async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    keywords = '',
    categoryId = '',
    tagId = '',
    userId = '',
    likeId = ''
  } = req.query

  const skipCount = Number((page - 1) * limit)
  const limitCount = Number(limit)
  const reg = new RegExp(decodeURIComponent(keywords), 'i')
  let findOption = {
    isRecommend: true
  }
  if (keywords) {
    findOption = {
      $or: [
        {
          title: {
            $regex: reg
          }
        },
        {
          content: {
            $regex: reg
          }
        }
      ]
    }
  }
  if (categoryId) {
    findOption = {
      category: categoryId
    }
  }
  if (tagId) {
    findOption = {
      user: userId
    }
  }
  if (likeId) {
    findOption = {
      likes: likeId
    }
  }
  try {
    const total = (await Article.find({
      ...findOption,
      isPublish: true
    }).exec()).length
    const data = await Article.find({
      ...findOption,
      isPublish: true
    })
      .populate({
        path: 'category',
        select: 'id name isShow'
      })
      .populate({
        path: 'tags',
        select: 'id name'
      })
      .populate({
        path: 'user',
        select: 'id username avatar email'
      })
      .skip(skipCount)
      .limit(limitCount)
      .sort({
        createdAt: -1
      })
      .exec()

    let arts = JSON.parse(JSON.stringify(data))
    // 私有分类下的文章不能被检索
    if (keywords) {
      arts = arts.filter(i => i.category.isShow !== false)
    }
    res.json({
      code: 200,
      data: arts,
      total
    })
  } catch (error) {
    res.status(404).josn({
      code: 404,
      data: '文章获取失败',
      error
    })
  }
}

exports.getArticlesTop = async (req, res, next) => {
  const { id } = req.params
  const opt = id
    ? { isTop: true, isPublish: true, category: id }
    : { isTop: true, isPublish: true }

  try {
    const data = await Article.find(opt)
      .populate({
        path: 'category',
        select: 'id name'
      })
      .populate({
        path: 'tags',
        select: 'id name'
      })
      .populate({
        path: 'user',
        select: 'id username avatar email'
      })
      .sort({
        createdAt: -1
      })
      .exec()
    res.json({
      code: 200,
      data
    })
  } catch (error) {
    res.json({
      code: 200,
      message: '置顶文章获取失败',
      error
    })
  }
}

exports.getDrafts = async (req, res, next) => {
  const { limit = 10, page = 1, userId = '' } = req.query
  const skipCount = Number((page - 1) * limit)
  const limitCount = Number(limit)

  try {
    const total = (await Article.find({
      isPublish: false,
      user: userId
    }).exec()).length
    const data = await Article.find({
      isPublish: false,
      user: userId
    })
      .populate({
        path: 'category',
        select: 'id name'
      })
      .populate({
        path: 'tags',
        select: 'id name'
      })
      .populate({
        path: 'user',
        select: 'id username avatar email'
      })
      .skip(skipCount)
      .limit(limitCount)
      .sort({
        createdAt: -1
      })
      .exec()
    res.json({
      code: 200,
      data,
      total
    })
  } catch (error) {
    res.status(404).json({
      data: '草稿获取失败',
      error
    })
  }
}

exports.postArticle = async (req, res, next) => {
  let { body } = req
  try {
    if (!body.category) body.category = null
    body = await new Article(body).save()
    res.json({
      code: 200,
      data: body
    })
  } catch (error) {
    res.json({
      code: 400,
      data: '文章添加失败',
      error
    })
  }
}

exports.patchArticle = async (req, res, next) => {
  let { body } = req
  const { id } = req.params
  try {
    if (!body.category) body.category = null // 未添加分类的文章
    body = await Article.findByIdAndUpdate(id, body).exec()
    res.json({
      code: 200,
      data: body
    })
  } catch (error) {
    res.json({
      code: 404,
      data: '文章更新失败'
    })
  }
}

exports.deleteArticle = async (req, res, next) => {
  const { id } = req.params
  try {
    const body = await Article.findByIdAndRemove(id).exec()
    res.json({
      code: 200,
      data: body,
      msg: '文章删除成功'
    })
  } catch (error) {
    res.json({
      code: 404,
      msg: '文章删除失败',
      error
    })
  }
}

exports.patchArticleLikes = async (req, res, next) => {
  const { id } = req.params
  const { userId } = req.locals.user
  const article = await Article.findOne({ _id: id }).exec()
  const likes = article.likes.map(i => i.toString()) // 获取 likes 数组
  if (likes.includes(userId)) {
    await Article.findByIdAndUpdate(
      id,
      {
        $pull: {
          likes: userId
        }
      },
      {
        safe: true,
        upsert: true
      }
    )
    res.json({
      code: 200,
      data: '已经取消喜欢'
    })
  } else {
    await Article.findByIdAndUpdate(
      id,
      {
        $push: {
          likes: userId
        }
      },
      {
        safe: true,
        upsert: true
      }
    )
    res.json({
      code: 200,
      data: '已经加入喜欢'
    })
  }
}
