import { Document } from 'mongoose'
export interface User extends Document {
  _id?: string
  name: string
  surname: string
  nickname: string
  rating?: number
  votes?: Array<{ voter: string; value: number }>
  password?: string
  role?: string
  salt?: string
  lastVoted?: number
  isDeleted?: boolean
  avatar?: string
  updatedAt?: string
  deletedAt?: boolean
  createdAt?: string
}
