import { Schema } from 'mongoose'
import { softDeletePlugin } from 'soft-delete-plugin-mongoose'
const UserSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 4,
      required: true,
    },
    surname: {
      type: String,
      minlength: 4,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      minlength: 4,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    salt: {
      type: String,
      required: true,
    },
    votes: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'user'],
      default: 'user',
    },
    lastVoted: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true, validateBeforeSave: true },
)
UserSchema.plugin(softDeletePlugin)

export default UserSchema
