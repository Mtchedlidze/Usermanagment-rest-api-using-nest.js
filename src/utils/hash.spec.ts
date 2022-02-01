import { Test } from '@nestjs/testing'
import { HashPassword } from './hash'

describe('hash password with salt', () => {
  let hashPassword: HashPassword
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [HashPassword],
    }).compile()

    hashPassword = moduleRef.get<HashPassword>(HashPassword)
  })

  describe('should hash password with salt', () => {
    const pass = 'secret'
    let salt, password
    beforeEach(async () => {
      const secrets = await hashPassword.hash(pass)
      salt = secrets.salt
      password = secrets.password
    })
    test('password should be hashed, salt should be defined', () => {
      expect(pass !== password)
      expect(salt).toBeDefined()
    })
  })
})
