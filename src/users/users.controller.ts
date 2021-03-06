import {
  Controller,
  Get,
  Query,
  Param,
  Body,
  Post,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  Put,
  Delete,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common'

import { CreateUserDto } from './dto/createUser.dto'
import { UsersService } from './users.service'
import { User } from './interface/user.interface'
import { VoteDto } from './dto/votes.dto'
import { NotVoteException } from './exceptions/NotVote.exception'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UptadeUserDto } from './dto/updateUser.dto'
import { HashPassword } from '../utils/hash'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '../auth/user.role'
import { RolesGuard } from '../auth/guards/roles.guard'
import { UpdateInterceptor } from './interceptors/update.interceptor'
import { UpdateGuard } from './guards/update.guard'
import { LocalAuthGuard } from '../auth/guards/local-auth.guard'

@Controller('users')
export class UsersController {
  //#region constructor
  constructor(
    private readonly usersService: UsersService,
    private readonly hashPassword: HashPassword
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
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<string> {
    return req.user
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
    body.voter = req.user.nickname
    try {
      const response = await this.usersService.ratings(body)
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
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard, UpdateGuard)
  @UseInterceptors(new UpdateInterceptor())
  async updateOne(@Body() body: UptadeUserDto, @Request() req, @Query() query) {
    const { nickname } = query.nickname ? query : req.user //since admin has ability to modify others, also he/she can modify him/herself
    if (body.password) {
      const secrets = await this.hashPassword.hash(body.password)
      body.password = secrets.password
      body.salt = secrets.salt
    }

    const updatedUser = await this.usersService
      .updateOne(nickname, body)
      .catch(() => {
        throw new BadRequestException()
      })

    return updatedUser
  }
  //#endregion

  //#region  delete one
  @Delete('/delete/:nickname')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteOne(@Param('nickname') nickname: string): Promise<{ deleted: number }> {
    return this.usersService.deleteOne(nickname)
  }
  //#endregion
}
