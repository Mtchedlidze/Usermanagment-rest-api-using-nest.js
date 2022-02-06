process.env.TEST = 'true'
import { AppModule } from '../src/app.module'
import request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { userStub } from '../src/users/test/stubs/user.stub'

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
      .send(userStub())
      .expect(201)
      .then((data) => {
        expect(data.body.nickname).toStrictEqual(userStub().nickname)
      })
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

  it('should return array of users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .then((data) => {
        expect(data.body).toHaveLength(1)
      })
  })

  it('should update user', () => {
    return request(app.getHttpServer())
      .put('/users/update')
      .send({ name: 'newName' })
      .set('Authorization', token)
      .expect(200)
      .then((data) => {
        expect(data.body.name).toStrictEqual('newName')
      })
  })

  it('should  not update user without authorization', () => {
    return request(app.getHttpServer())
      .put('/users/update')
      .send({ name: 'newName' })
      .expect(401)
  })

  it('should delete user with nickname', () => {
    return request(app.getHttpServer())
      .delete(`/users/delete/${userStub().nickname}`)
      .set('Authorization', token)
      .expect(200)
      .then((data) => {
        expect(data.body.deleted).toStrictEqual(1)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
