import { IsString, MinLength, Matches } from 'class-validator'

enum UserRole {
  user,
  admin,
  moderator,
}
const match = `^${Object.values(UserRole)
  .filter((v) => typeof v !== 'number')
  .join('|')}$`

export class CreateUserDto {
  @IsString()
  readonly name: string
  @IsString()
  readonly surname: string
  @MinLength(4)
  @IsString()
  readonly nickname: string
  @MinLength(6)
  @IsString()
  password: string
  salt: string
  @IsString()
  @Matches(match, 'i')
  readonly role: string
}
