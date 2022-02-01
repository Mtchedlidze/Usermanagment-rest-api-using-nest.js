import { Injectable } from '@nestjs/common'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { User } from './interface/user.interface'
import { InjectModel } from '@nestjs/mongoose'
import { NotVoteException } from './exceptions/NotVote.exception'
import { CreateUserDto } from './dto/createUser.dto'
import { NotCreateException } from './exceptions/NotCreate.exception'
import { UptadeUserDto } from './dto/updateUser.dto'
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>
  ) {}

  //#region  findall
  async findAll(params?: { limit: number; skip: number }): Promise<User[]> {
    const { limit, skip } = params || null

    const users = await this.userModel
      .find()
      .skip(skip || null)
      .limit(limit || null)
      .select(['-password', '-salt'])

    return users.map((user) => {
      const rating = user.votes.reduce((a, b) => a + (b['vote'] || 0), 0)
      user.rating = rating
      return user
    })
  }

  //#endregion

  //#region  findOne
  async findOne(nickname: string): Promise<User> {
    const user = await this.userModel
      .findOne({ nickname: nickname })
      .select(['-password', '-salt'])
    if (user) {
      user.rating = user.votes.reduce((a, b) => a + (b['vote'] || 0), 0)
    }

    return user
  }
  //#endregion

  //#region  create
  async create(user: CreateUserDto): Promise<User> {
    const userExists = await this.userModel.exists({ nickname: user.nickname })
    if (userExists) {
      throw new NotCreateException('user already exists with this nickname')
    }
    const newUser = new this.userModel(user)
    return await newUser.save()
  }
  //#endregion

  //#region update user
  async updateOne(
    nickname: string,
    updatedObj: Partial<UptadeUserDto>
  ): Promise<User> {
    const user = await this.userModel.findOne({ nickname })

    if (!user) {
      throw new Error('user not found')
    }
    Object.assign(user, updatedObj)

    await user.save()

    return await this.findOne(nickname)
  }
  //#endregion

  //#region delete user
  async deleteOne(nickname: string): Promise<{ deleted: number }> {
    const user = await this.userModel.findOne({ nickname })
    console.log(user)

    const deleted = this.userModel.softDelete(
      { nickname: nickname },
      { validateBeforeSave: false }
    )
    return deleted
  }

  //#endregion

  //#region  findUser
  async findUser(nickname: string): Promise<User> {
    return await this.userModel.findOne({ nickname })
  }

  //#endregion

  //#region  ratings

  async ratings(params: {
    voter: string
    value: number
    withdraw: boolean
    user: string
  }): Promise<string> {
    const { voter, value, user, withdraw } = params

    const userToVote = await this.userModel.findOne({ nickname: user })
    if (!userToVote) {
      throw new NotVoteException('User not found')
    }
    if (voter === user) {
      throw new NotVoteException('You can not vote yourself')
    }

    const whovotes = await this.userModel.findOne({ nickname: voter })

    const hasvoted = userToVote.votes
      .map((e) => e.voter === voter)
      .includes(true)

    if (!hasvoted && withdraw) {
      throw new NotVoteException('you have not voted yet')
    }
    if (hasvoted) {
      if (withdraw) {
        userToVote.votes = userToVote.votes.filter((e) => e.voter !== voter)

        await userToVote.save()
        await whovotes.save()

        return 'your vote has been withdrawn'
      }
      const previousValue = userToVote.votes.filter((e) => e.voter === voter)[0]
        .value

      if (previousValue !== value) {
        const index = userToVote.votes.findIndex((e) => e.voter === voter)
        userToVote.votes[index].value = value
        userToVote.markModified('votes')
        await userToVote.save()

        return `your vote has been updated to ${value}`
      }
      throw new NotVoteException(
        'you can not vote twice to same user, you can change or withdraw your vote'
      )
    }
    if (Date.now() - whovotes.lastVoted < 3600000) {
      throw new NotVoteException('you cant vote untill 1 hour passes')
    }

    userToVote.votes.push({
      voter: voter,
      value: value,
    })
    whovotes.lastVoted = Date.now()
    await userToVote.save()
    await whovotes.save()
    return 'your vote has been saved'
  }
  //#endregion

  //#region  avatar
  async addAvatar(nickname: string, avatar: string) {
    const user = await this.userModel.findOne({ nickname })
    user.avatar = avatar

    await user.save()
  }
}
