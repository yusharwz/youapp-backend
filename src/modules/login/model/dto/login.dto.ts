import { IsEmail, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  username?: string;

  password: string;
}
