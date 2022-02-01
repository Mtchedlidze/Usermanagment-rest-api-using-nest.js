import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import UserSchema from './schemas/users.schema'
import { HashPassword } from '../utils/hash'
import { AuthModule } from '../auth/auth.module'
import { SqsService } from '../sqs/sqs.service'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, HashPassword, SqsService],
  exports: [UsersService],
})
export class UsersModule {}
