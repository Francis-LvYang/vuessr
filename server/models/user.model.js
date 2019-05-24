const mongoose = require('mongoose')
// 用于md5加密
const bcrypt = require('bcryptjs')
// 加密强度
const SALT_WORK_FACTOR = 10
const { Schema } = mongoose
const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'user'],
      default: 'user'
    },
    username: {
      type: String,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: String,
    description: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    isVerifyEmail: {
      type: Boolean,
      default: false
    },
    loginMode: {
      type: String,
      default: 'github',
      enum: ['github', 'register']
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.createdAt
        delete ret.updatedAt
      }
    },
    minimize: false
  }
)
// 对密码进行加密
UserSchema.pre('save', function(next) {
  const user = this
  if (this.isNew) {
    this.createAt = this.updateAt = Date.now()
  } else {
    this.updateAt = Date.now()
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})
// 比较密码是否正确
UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)
      cb(null, isMatch)
    })
  }
}
mongoose.model('User', UserSchema)
