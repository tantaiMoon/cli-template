import { defineMongooseModel } from '#nuxt/mongoose'

export interface UserDataProps {
  username: string
  password: string
  email?: string
  nickName?: string
  avatar?: string
  phoneNumber?: string
  createdAt: string
  updatedAt: string
  type: 'email' | 'collphone' | 'oauth'
  provider?: 'gitee'
  oauthID?: string
  role?: 'admin' | 'normal'
}

export const UserSchema = defineMongooseModel<UserDataProps>(
  'User',
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: { type: String },
    nickName: {
      type: String
    },
    avatar: {
      type: String
    },
    email: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    type: {
      type: String,
      default: 'email'
    },
    provider: {
      type: String
    },
    oauthID: {
      type: String
    },
    role: {
      type: String,
      default: 'normal'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        // delete ret.password
        delete ret.__v
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)
