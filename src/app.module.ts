import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { AwsSdkModule } from 'nest-aws-sdk'
import { SQS } from 'aws-sdk'
import { UsersModule } from './users/users.module'

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
})
export class AppModule {}
