const mongoose = require('mongoose')
const Medium = mongoose.model('Medium')
const Category = mongoose.model('Category')
const path = require('path')
const fs = require('fs')

exports.getMediums = async (req, res, next) => {
  const { id } = req.params
  try {
    const data = await Medium.find({ category: id })
      .populate({
        path: 'category',
        select: 'id name isShow'
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
      code: 404,
      data: '媒体库获取失败',
      error
    })
  }
}

exports.patchMedium = async (req, res, next) => {
  const { id } = req.params
  const { body } = req
  try {
    let data = null
    data = await Medium.findOne({ filename: body.filename }).exec()
    if (data) {
      res.json({
        coe: 200,
        data: '文件名已经存在'
      })
    }
    data = await Medium.findByIdAndUpdate(id, body).exec()
    res.json({
      code: 200,
      data
    })
  } catch (error) {
    res.json({
      code: 200,
      data: '文件更新失败',
      error
    })
  }
}

exports.deleteMedium = async (req, res, next) => {
  const { filename } = req.params
  try {
    const body = await Medium.findOneAndRemove({ filename }).exec()
    fs.unlinkSync(
      path.json(path.resolve(__dirname, '../../public/medium/', filename))
    )
    res.json({
      code: 200,
      data: body
    })
  } catch (error) {
    res.json({
      code: 404,
      data: '文件删除失败',
      error
    })
  }
}
