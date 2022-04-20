import { Test } from '@nestjs/testing'
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

  describe('findOne', () => {
    describe('when findOne is called', () => {
      beforeEach(async () => {
        await userscontroller.findOne(userStub().nickname)
      })
      test('it should call userSservice', () => {
        expect(usersService.findOne).toBeCalledWith(userStub().nickname)
      })
    })
  })

  describe('findAll', () => {
    describe('when findAll called', () => {
      beforeEach(async () => {
        await userscontroller.findAll(2, null)
      })

      test('it should call usersservice', () => {
        expect(usersService.findAll).toBeCalledWith({ limit: 2, skip: null })
      })
    })
  })

  describe('deleteOne', () => {
    describe('when deleteOne called', () => {
      beforeEach(async () => {
        await userscontroller.deleteOne(userStub().nickname)
      })

      test('it should call userservice deleteOne', () => {
        expect(usersService.deleteOne).toBeCalledWith(userStub().nickname)
      })
    })
  })
})
