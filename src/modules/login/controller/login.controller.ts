import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginService } from '../service/login.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../model/dto/login.dto';

@Controller('api/login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.loginService.validateUser(
      loginDto.email,
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.loginService.generateToken(user);

    return { token };
  }
}
