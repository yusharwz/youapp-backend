import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { LoginService } from './service/login.service';
import { LoginController } from './controller/login.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '600m' },
    }),
  ],
  providers: [LoginService, JwtStrategy],
  controllers: [LoginController],
})
export class LoginModule {}
