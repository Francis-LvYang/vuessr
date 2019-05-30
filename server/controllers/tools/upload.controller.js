const path = require('path')
const fs = require('fs')
const formidable = require('formidable')
const mongoose = require('mongoose')
const globalConfig = require('../../config/global.config')

const Medium = mongoose.model('Medium')

exports.img = async (req, res, next) => {
  const form = new formidable.IncomingForm()
  function getImgUrl(request) {
    return new Promise((resolve, reject) => {
      form.parse(request, (err, fields, files) => {
        if (err) {
          reject(err)
        }
        const filename = Object.keys(files)[0]
        const lastItem = files[filename]
        // 获取文件后缀名
        const extname = Date.now() + path.extname(filename)
        const oldUrl = lastItem.path
        const newUrl = path.join(path.resolve(__dirname, '../../public/picture/'), extname)
        // 文件重命名，上传到服务器
        const readStream = fs.createReadStream(oldUrl)
        const writeStream = fs.createWriteStream(newUrl)
        readStream.pipe(writeStream)
        const imgUrl = `${globalConfig.app.domain}/public/picture/${extname}`
        resolve(imgUrl)
      })
    })
  }
  await getImgUrl(req, res).then(url => {
    res.send(url)
  })
}

exports.file = async (req, res, next) => {
  const form = new formidable.IncomingForm()
  function getFileUrl(request) {
    return new Promise((resolve, reject) => {
      form.parse(request, async (err, fields, files) => {
        if (err) {
          reject(err)
        }
        const filename = Object.keys(files)[0]
        const lastItem = files[filename]
        let extname = lastItem.name
        const data = await Medium.find({ filename: lastItem.name }).exec()

      })
    })
  }
}
