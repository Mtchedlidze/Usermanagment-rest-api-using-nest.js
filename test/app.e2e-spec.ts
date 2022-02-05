process.env.TEST = 'true'
import { AppModule } from '../src/app.module'
import request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { createUserStub, userStub } from '../src/users/test/stubs/user.stub'
import { UsersController } from '../src/users/users.controller'

describe('users', () => {
  let app: INestApplication
  let usersController: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    usersController = module.get<UsersController>(UsersController)
    await app.init()
  })
  //   it('should create new user', () => {
  //     return request(app.getHttpServer())
  //       .post('/users/signup')
  //       .send(createUserStub())
  //       .expect(201)
  //   })

  it('should return array of users', () => {
    return request(app.getHttpServer())
      .get(`/users/${userStub().nickname}`)
      .expect(200)
      .then((data) => {
        expect(usersController.findOne(userStub().nickname)).toStrictEqual(
          data.body.nickname
        )
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
