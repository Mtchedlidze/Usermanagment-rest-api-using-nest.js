import { User } from '../../interface/user.interface'

export const userStub = (): Partial<User> => {
  return {
    name: 'testName',
    surname: 'testSurname',
    nickname: 'testNickname',
    password: 'testPassword',
    role: 'admin',
  }
}
