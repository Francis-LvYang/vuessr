const qr = require('qr-image')

exports.qrcode = (req, res, next) => {
  const code = qr.image('http://www.google.com', { type: 'png' })
  res.setHeader('Content-type', 'image/png')
  code.pipe(res)
}
