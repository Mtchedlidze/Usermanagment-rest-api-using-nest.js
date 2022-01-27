import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/core/users.module'
import { ConfigModule } from '@nestjs/config'
import { AwsSdkModule } from 'nest-aws-sdk'
import { SQS } from 'aws-sdk'
import { SqsService } from './sqs/sqs.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MongooseModule.forRoot(process.env.DB_URI),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ID,
          secretAccessKey: process.env.AWS_SECRET,
        },
      },
      services: [SQS],
    }),
  ],
  providers: [SQS, SqsService],
})
export class AppModule {}
