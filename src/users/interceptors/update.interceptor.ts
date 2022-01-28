import {
  ExecutionContext,
  CallHandler,
  HttpException,
  Injectable,
} from '@nestjs/common'
import { UsersService } from '../core/users.service'

@Injectable()
export class UpdateInterceptor {
  constructor(private readonly usersService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const ifUnmodifiedHeader = req.headers['if-unmodified-since']

    const { nickname } = req.query || req.user
    const user = await this.usersService.findOne(nickname)

    req.res.setHeader('Last-Modified', user.updatedAt)

    if (ifUnmodifiedHeader && user.updatedAt !== ifUnmodifiedHeader) {
      throw new HttpException('user has been modified after last fetch', 412)
    }
    return next.handle()
  }
}
