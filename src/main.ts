import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { serve, setup } from 'swagger-ui-express'
import * as doc from './doc/documentation.json'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: '*' })
  app.useGlobalPipes(new ValidationPipe())
  app.use('/api', serve)
  app.use('/api', setup(doc))

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
