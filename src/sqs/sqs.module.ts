import { Module } from '@nestjs/common'
import { SqsService } from './sqs.service'
import { UsersService } from '../users/core/users.service'
import { UsersModule } from 'src/users/core/users.module'

@Module({
  imports: [UsersModule],
  providers: [SqsService, UsersService],
  exports: [SqsService],
})
export class SqsModule {}
