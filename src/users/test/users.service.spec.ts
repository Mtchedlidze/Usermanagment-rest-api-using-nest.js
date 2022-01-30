import { Test } from '@nestjs/testing'
import { UsersService } from '../core/users.service'

describe('UsersConroler', () => {
  let service: UsersService

  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
      findAll: () => Promise.resolve([]),
      deleteOne: () => Promise.resolve({ deleted: 1 }),
    }

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile()

    service = module.get(UsersService)
  })

  it('should make fake usersService', async () => {
    expect(service).toBeDefined()
  })

  it('should return array of users or empty array', async () => {
    const users = await service.findAll()
    expect(users).toStrictEqual([])
  })

  it('should delete user', async () => {
    const result = await service.deleteOne('test')
    expect(result).toStrictEqual({ deleted: 1 })
  })
})
