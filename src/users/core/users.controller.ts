import {
  Controller,
  Get,
  Query,
  Param,
  Body,
  Post,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  Put,
  Delete,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'

import { CreateUserDto } from '../dto/createUser.dto'
import { LoginDto } from '../dto/login.dto'
import { UsersService } from './users.service'
import { User } from '../interface/user.interface'
import { AuthService } from '../../auth/auth.service'
import { VoteDto } from '../dto/votes.dto'
import { NotVoteException } from '../exceptions/NotVote.exception'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { UptadeUserDto } from '../dto/updateUser.dto'
import { HashPassword } from '../../utils/hash'

@Controller('users')
export class UsersController {
  //#region constructor
  constructor(
    private readonly usersService: UsersService,
    private readonly hashPassword: HashPassword,
    private readonly auth: AuthService
  ) {}
  //#endregion

  //#region findall
  @Get()
  findAll(
    @Query('limit') limit: number,
    @Query('skip') skip: number
  ): Promise<User[]> {
    return this.usersService.findAll({ skip, limit })
  }
  //#endregion

  //#region findOne
  @Get(':nickname')
  findOne(@Param('nickname') nickname: string): Promise<User> {
    return this.usersService.findOne(nickname)
  }
  //#endregion

  //#region  create
  @Post('/signup')
  async crete(@Body() userDto: CreateUserDto): Promise<User> {
    try {
      const secrets = await this.hashPassword.hash(userDto.password)
      userDto = {
        ...userDto,
        password: secrets && secrets.password,
        salt: secrets && secrets.salt,
      }
      const createdUser = await this.usersService.create(userDto)
      return createdUser
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
  //#endregion

  //#region  login
  @Post('/login')
  async login(@Body() body: LoginDto): Promise<User> {
    const { nickname, password } = body
    const token = await this.auth.validate(nickname, password)
    if (!token) {
      throw new UnauthorizedException()
    }

    throw new HttpException(token, 200)
  }
  //#endregion

  //#region  ratings
  @UseGuards(JwtAuthGuard)
  @Put('/ratings')
  @HttpCode(200)
  async ratings(
    @Body() body: VoteDto,
    @Request() req: { user: { nickname: string; role: string } }
  ): Promise<{ statusCode: number; message: string }> {
    const voteObj = {
      ...body,
      voter: req.user.nickname,
    }
    try {
      const response = await this.usersService.ratings(voteObj)
      return {
        message: response,
        statusCode: 200,
      }
    } catch (error) {
      if (error instanceof NotVoteException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
      }
    }
  }
  //#endregion

  //#region update user
  @Put('/update')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Body() body: UptadeUserDto,
    @Request() req,
    @Query() query
  ): Promise<User> {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException()
    }
    const { nickname } = query.nickname ? query : req.user //since admin has ability to modify others, also he/she can modify him/herself
    const userToModify = await this.usersService.findOne(nickname)

    req.res.setHeader('last-modified', userToModify.updatedAt)
    if (
      req.headers['if-unmodified-since'] &&
      req.headers['if-unmodified-since'] !== userToModify.updatedAt
    ) {
      throw new HttpException(
        'The resource has been modified since the last request.',
        HttpStatus.PRECONDITION_FAILED
      )
    }

    if (body.password) {
      const secrets = await this.hashPassword.hash(body.password)
      body.password = secrets.password
      body.salt = secrets.salt
    }

    const updatedUser = this.usersService
      .updateOne(nickname, body)
      .catch(() => {
        throw new BadRequestException()
      })

    return updatedUser
  }
  //#endregion

  //#region  delete one
  @Delete('/delete/:nickname')
  @UseGuards(JwtAuthGuard)
  deleteOne(
    @Request() req: { user: { nickname: string; role: string } },
    @Param('nickname') nickname: string
  ): Promise<{ deleted: number }> {
    const { role } = req.user
    if (role !== 'admin') {
      throw new ForbiddenException()
    }
    return this.usersService.deleteOne(nickname)
  }
  //#endregion
}
