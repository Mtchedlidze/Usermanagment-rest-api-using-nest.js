import { User } from '../../interface/user.interface'

export const userStub = (): Partial<User> => {
  return {
    _id: '61f11ef48597547a6314231f',
    name: 'somename',
    surname: 'surname',
    nickname: 'someNickname',
    role: 'admin',
    rating: 0,
    votes: [],
    lastVoted: 0,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2022-01-26T10:14:12.875Z',
    updatedAt: '2022-01-31T18:19:14.118Z',
    __v: 0,
    avatar: 'https://usersmanagment.s3.eu-central-1.amazonaws.com/string',
  }
}

export const createUserStub = (): Partial<User> => {
  return {
    name: 'testName',
    surname: 'testSurname',
    nickname: 'testNickname',
    password: 'testPassword',
    role: 'admin',
  }
}
