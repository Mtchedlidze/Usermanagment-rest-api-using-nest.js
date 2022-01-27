import { Module } from '@nestjs/common'
import { SqsService } from './sqs.service'
import { UsersModule } from 'src/users/core/users.module'
@Module({
  imports: [UsersModule],
  providers: [SqsService],
  exports: [SqsService],
})
export class SqsModule {}
