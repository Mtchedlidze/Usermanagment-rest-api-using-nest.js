import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/core/users.module'
import { HashPassword } from '../utils/hash'
import { AuthService } from './auth.service'
import { RolesGuard } from './guards/roles.guard'
import { JwtStrategy } from './jwt.stategy'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({ secret: 'supersecret' }),
    PassportModule,
  ],

  providers: [AuthService, HashPassword, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
