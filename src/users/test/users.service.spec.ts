import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'
import { UsersService } from '../core/users.service'
import { CreateUserDto } from '../dto/createUser.dto'
import UserSchema from '../schemas/users.schema'

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // it('should return users', () => {
  //   expect(service.findAll()).toEqual([{}])
  // })

  it('should return user by nickname', () => {
    jest
      .spyOn(service, 'findOne')
      .mockImplementation((nickname: string) => service.findOne(nickname))
  })
})
