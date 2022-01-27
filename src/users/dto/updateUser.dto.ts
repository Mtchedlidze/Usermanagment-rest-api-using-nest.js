import { IsString, IsOptional, MinLength } from 'class-validator'

export class UptadeUserDto {
  @IsOptional()
  @IsString()
  readonly name: string

  @IsString()
  @IsOptional()
  readonly surname: string

  @IsOptional()
  @MinLength(6)
  @IsString()
  password: string

  @IsOptional()
  salt: string
}
