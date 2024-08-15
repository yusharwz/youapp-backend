import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @Length(3, 25, { message: 'Username must be between 3 and 25 characters' })
  @Matches(/^\S*$/, { message: 'Username cannot contain spaces' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
