process.env.TEST = 'true'
import { AppModule } from '../src/app.module'
import request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { userStub } from '../src/users/test/stubs/user.stub'
import mongoose from 'mongoose'

jest.setTimeout(30000)

describe('users', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = module.createNestApplication()
    await app.init()
  }, 30000)

  it('should create new user', async () => {
    const data = await request(app.getHttpServer())
      .post('/users/signup')
      .send(userStub())
      .expect(201)
    expect(data.body.nickname).toStrictEqual(userStub().nickname)
  })

  it('should return token', async () => {
    await request(app.getHttpServer())
      .post('/users/login')
      .send({
        nickname: userStub().nickname,
        password: userStub().password,
      })
      .expect(200)
  })

  it('should find user with nickname', async () => {
    const data = await request(app.getHttpServer())
      .get(`/users/${userStub().nickname}`)
      .expect(200)
    expect(data.body.nickname).toStrictEqual(userStub().nickname)
  })

  it('should return array of users', async () => {
    const data = await request(app.getHttpServer()).get('/users').expect(200)
    expect(data.body).toHaveLength(1)
  })

  it('should update user', async () => {
    const loginData = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        nickname: userStub().nickname,
        password: userStub().password,
      })
      .expect(200)

    const token = 'Bearer ' + loginData.text

    const data = await request(app.getHttpServer())
      .put('/users/update')
      .send({ name: 'newName' })
      .set('Authorization', token)
      .expect(200)
    expect(data.body.name).toStrictEqual('newName')
  })

  it('should  not update user without authorization', async () => {
    return request(app.getHttpServer())
      .put('/users/update')
      .send({ name: 'newName' })
      .expect(401)
  })

  it('should delete user with nickname', async () => {
    const loginData = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        nickname: userStub().nickname,
        password: userStub().password,
      })
      .expect(200)

    const token = 'Bearer ' + loginData.text

    const data = await request(app.getHttpServer())
      .delete(`/users/delete/${userStub().nickname}`)
      .set('Authorization', token)
      .expect(200)
    expect(data.body.deleted).toStrictEqual(1)
  })

  afterAll(async () => {
    await mongoose.connection.close()
    await app.close()
  })
})
