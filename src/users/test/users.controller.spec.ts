import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AuthModule } from '../../auth/auth.module'
import { AuthService } from '../../auth/auth.service'
import { HashPassword } from '../../utils/hash'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'
import { userStub } from './stubs/user.stub'
import { createMock } from '@golevelup/ts-jest'

describe('userscontroller', () => {
  let userscontroller: UsersController
  let usersService: UsersService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
        {
          provide: HashPassword,
          useValue: createMock<HashPassword>(),
        },
      ],
    }).compile()

    userscontroller = moduleRef.get<UsersController>(UsersController)
    usersService = moduleRef.get<UsersService>(UsersService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    describe('when findOne is called', () => {
      beforeEach(async () => {
        const user = await userscontroller.findOne(userStub().nickname)
      })
      test('it should call userSservice', () => {
        expect(usersService.findOne).toBeCalledWith(userStub().nickname)
      })
    })
  })
})
