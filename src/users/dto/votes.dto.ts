import {
  IsInt,
  IsString,
  IsBoolean,
  NotEquals,
  Max,
  Min,
  IsOptional,
} from 'class-validator'

export class VoteDto {
  @IsString()
  user: string
  @IsInt()
  @NotEquals(0)
  @Max(1)
  @Min(-1)
  value: number
  @IsBoolean()
  withdraw: boolean
  @IsOptional()
  voter: string
}
