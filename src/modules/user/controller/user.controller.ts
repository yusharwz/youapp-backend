import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UpdateUserDto } from '../model/dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RequestWithUser } from '../../../types/express-request.interface';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('getProfile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    return this.userService.getUserById(req.user.userId);
  }

  @Put('updateUser')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.userService.updateUser(req.user.userId, updateUserDto);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  @Delete('deleteProfile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@Req() req: RequestWithUser) {
    return this.userService.deleteUser(req.user.userId);
  }
}
