import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/core/users.module'
import { HashPassword } from 'src/utils/hash'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.stategy'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({ secret: 'supersecret' }),
    PassportModule,
  ],

  providers: [AuthService, HashPassword, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
