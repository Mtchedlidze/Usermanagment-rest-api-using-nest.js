import {
  HttpException,
  Injectable,
  ExecutionContext,
  CanActivate,
} from '@nestjs/common'

import { UsersService } from '../users.service'

@Injectable()
export class UpdateGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const { nickname } = req.query || req.user

    const user = await this.usersService.findOne(nickname)

    const ifUnmodifiedHeader = req.headers['if-unmodified-since']

    const userLastModified = new Date(user.updatedAt)
    if (ifUnmodifiedHeader && ifUnmodifiedHeader !== userLastModified) {
      throw new HttpException('user has been modified after last fetch', 412)
    }

    return true
  }
}
