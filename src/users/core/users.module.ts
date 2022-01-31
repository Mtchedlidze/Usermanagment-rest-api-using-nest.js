import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import UserSchema from '../schemas/users.schema'
import { HashPassword } from '../../utils/hash'
import { AuthModule } from '../../auth/auth.module'
import { SqsService } from '../../sqs/sqs.service'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { UpdateInterceptor } from '../interceptors/update.interceptor'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    HashPassword,
    SqsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UpdateInterceptor,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
