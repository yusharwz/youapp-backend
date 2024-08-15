import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../model/profile.schema';
import { CreateProfileDto } from '../model/dto/create-profile.dto';
import { getHoroscopeAndZodiac } from '../../../utils/astrology.utils';
import { User, UserDocument } from '../../user/model/user.schema';
import { EditProfileDto } from '../model/dto/edit-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.profileId) {
      throw new ConflictException('User already has a profile');
    }

    const { birthDate } = createProfileDto;
    const birthDateObj = new Date(birthDate);

    const { horoscope, zodiac } = getHoroscopeAndZodiac(birthDateObj);
    const createdProfile = new this.profileModel({
      ...createProfileDto,
      horoscope,
      zodiac,
    });

    const profile = await createdProfile.save();

    await this.userModel
      .findByIdAndUpdate(userId, { profileId: profile._id })
      .exec();

    return profile;
  }

  async editProfile(
    userId: string,
    editProfileDto: EditProfileDto,
  ): Promise<Profile> {
    const user = await this.userModel.findById(userId).exec();
    if (!user || !user.profileId) {
      throw new NotFoundException('Profile not found for the user');
    }

    const profileId = user.profileId;
    const profile = await this.profileModel.findById(profileId).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    profile.displayName = editProfileDto.displayName || profile.displayName;
    profile.gender = editProfileDto.gender || profile.gender;
    profile.height = editProfileDto.height || profile.height;
    profile.weight = editProfileDto.weight || profile.weight;

    if (editProfileDto.birthDate) {
      const birthDateObj = new Date(editProfileDto.birthDate);
      profile.birthDate = birthDateObj;

      const { horoscope, zodiac } = getHoroscopeAndZodiac(birthDateObj);
      profile.horoscope = horoscope;
      profile.zodiac = zodiac;
    }

    if (editProfileDto.interests) {
      const existingInterests = new Set(profile.interests);
      const newInterests = new Set(editProfileDto.interests);

      const interestsToAdd = Array.from(newInterests).filter(
        (interest) => !existingInterests.has(interest),
      );
      const interestsToRemove = Array.from(existingInterests).filter(
        (interest) => !newInterests.has(interest),
      );

      profile.interests = Array.from(
        new Set([...existingInterests, ...interestsToAdd]),
      );

      profile.interests = profile.interests.filter(
        (interest) => !interestsToRemove.includes(interest),
      );
    }

    profile.updatedAt = new Date();

    return profile.save();
  }
}
