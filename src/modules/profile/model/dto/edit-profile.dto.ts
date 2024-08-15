import { IsString, IsOptional, IsArray } from 'class-validator';

export class EditProfileDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  birthDate?: string;

  horoscope?: string;

  zodiac?: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
}
