const mongoose = require('mongoose')
const { Schema } = mongoose

const ArticleSchema = new Schema(
  {
    title: {
      type: String
    },
    content: {
      type: String
    },
    abstract: {
      type: String,
      default: ''
    },
    thumbnail: {
      type: String,
      default: ''
    },
    isTop: {
      type: Boolean,
      default: false
    },
    isPublish: {
      type: Boolean,
      default: true
    },
    isRecommend: {
      type: Boolean,
      default: true
    },
    enableComment: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    },
    flag: {
      type: Number,
      default: 0
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    category: {
      type: Schema.ObjectId,
      ref: 'Category'
    },
    likes: [{ type: Schema.ObjectId, ref: 'User' }],
    media: [{ type: Schema.ObjectId, ref: 'Media' }],
    extends: [
      {
        name: { type: String, require: true },
        value: { type: Schema.Types.Mixed, default: '' }
      }
    ],
    tags: [{ type: Schema.ObjectId, ref: 'Tag' }]
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
        if (!ret.category) {
          ret.category = {}
        }
      }
    },
    minimize: false
  }
)
mongoose.model('Article', ArticleSchema)
