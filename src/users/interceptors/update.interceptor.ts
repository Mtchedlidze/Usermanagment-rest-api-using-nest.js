import {
  ExecutionContext,
  CallHandler,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { User } from 'aws-sdk/clients/budgets'
import { Observable, tap } from 'rxjs'

@Injectable()
export class UpdateInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<User>> {
    return next.handle().pipe(
      tap((user) => {
        if (!user) {
          return
        }
        const res = context.switchToHttp().getResponse()
        res.setHeader('last-modified', user.updatedAt)
      })
    )
  }
}
