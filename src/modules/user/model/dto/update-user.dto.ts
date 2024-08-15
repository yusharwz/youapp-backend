import {
  IsOptional,
  IsString,
  IsEmail,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsString()
  @IsOptional()
  @Length(3, 25, { message: 'Username must be between 3 and 25 characters' })
  @Matches(/^\S*$/, { message: 'Username cannot contain spaces' })
  username?: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password?: string;

  @IsOptional()
  updatedAt?: Date;
}
