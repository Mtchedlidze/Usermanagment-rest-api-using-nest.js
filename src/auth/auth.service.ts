import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { HashPassword } from '../utils/hash'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly hashPassword: HashPassword
  ) {}

  async validate(nickname: string, password: string): Promise<string | null> {
    const user = await this.usersService.findUser(nickname)
    if (!user) {
      return
    }
    const secrets = await this.hashPassword.hash(password, user.salt)

    if (!user || user.password !== secrets.password) {
      return
    }
    const payload = {
      nickname: nickname,
      role: user.role,
    }

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: process.env.SECRET,
    })

    return token
  }
}
