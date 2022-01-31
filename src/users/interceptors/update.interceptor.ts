import {
  ExecutionContext,
  CallHandler,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { User } from 'aws-sdk/clients/budgets'
import { Observable, pipe, tap } from 'rxjs'
import { UsersService } from '../core/users.service'

@Injectable()
export class UpdateInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<User>> {
    const req = context.switchToHttp().getRequest()
    const ifUnmodifiedHeader = req.headers['if-unmodified-since']

    const { nickname } = req.query || req.user
    const user = await this.usersService.findOne(nickname)

    const userLastModified = new Date(user.updatedAt) //since mongodb timestams using different format

    // untill fist update occures, updatedAt value is equal to createdAt, so when someone fist fetch the resource
    // if-unmodified-since header will be the time will be createdAt time, so at the first update they will be equal
    // if they wont be equal, that means some change happened after last fetch
    if (ifUnmodifiedHeader && ifUnmodifiedHeader !== userLastModified) {
      throw new HttpException('user has been modified after last fetch', 412)
    }
    return next.handle().pipe(
      tap((user) => {
        //and if it passes check it will set last-modified header to updated user time
        req.res.setHeader('last-modified', user.updatedAt)
      })
    )
  }
}
