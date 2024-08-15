import {
  Controller,
  Post,
  Put,
  Req,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfileService } from '../service/profile.service';
import { CreateProfileDto } from '../model/dto/create-profile.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { EditProfileDto } from '../model/dto/edit-profile.dto';

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('createProfile')
  @UseGuards(JwtAuthGuard)
  async createProfile(
    @Request() req,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(req.user.userId, createProfileDto);
  }

  @Put('updateProfile')
  @UseGuards(JwtAuthGuard)
  async editProfile(@Req() req, @Body() editProfileDto: EditProfileDto) {
    return this.profileService.editProfile(req.user.userId, editProfileDto);
  }
}
