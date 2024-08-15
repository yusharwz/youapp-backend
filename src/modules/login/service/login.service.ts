import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/model/user.schema';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string | null,
    username: string | null,
    pass: string,
  ): Promise<User | null> {
    let user: User | null = null;

    if (email) {
      user = await this.userService.findByEmail(email);
    } else if (username) {
      user = await this.userService.findByUsername(username);
    }

    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }

    return null;
  }

  async generateToken(user: User): Promise<string> {
    const payload = { username: user.username, sub: user._id };
    return this.jwtService.sign(payload);
  }
}
