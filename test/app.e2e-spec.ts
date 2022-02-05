process.env.TEST = 'true'
import { AppModule } from '../src/app.module'
import request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { createUserStub, userStub } from '../src/users/test/stubs/user.stub'

// jest.useFakeTimers('modern')
jest.setTimeout(30000)

describe('users', () => {
  let app: INestApplication
  let token: string

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = module.createNestApplication()
    await app.init()
  }, 30000)
  it('should create new user', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send(createUserStub())
      .expect(201)
  })

  it('should return token', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        nickname: userStub().nickname,
        password: userStub().password,
      })
      .expect(200)
      .then((data) => {
        token = 'Bearer ' + data.text
        expect(data.body).toBeDefined()
      })
  })

  it('should find user with nickname', () => {
    return request(app.getHttpServer())
      .get(`/users/${userStub().nickname}`)
      .expect(200)
      .then((data) => {
        expect(data.body.nickname).toStrictEqual(userStub().nickname)
      })
  })
  it('should update user', () => {
    return request(app.getHttpServer())
      .put('/users/update')
      .send({ name: 'newName' })
      .set('Authorization', token)
      .expect(200)
      .then((data) => {})
  })
  it('should delete user with nickname', () => {
    return request(app.getHttpServer())
      .delete(`/users/${userStub().nickname}`)
      .then((data) => {
        expect(data.body.deleted).toStrictEqual(1)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
