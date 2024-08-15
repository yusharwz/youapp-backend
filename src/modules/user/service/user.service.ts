import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../model/user.schema';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UpdateUserDto } from '../model/dto/update-user.dto';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Profile, ProfileDocument } from '../../profile/model/profile.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        const errorMessage = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists.`;
        throw new ConflictException(errorMessage);
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email, deletedAt: null }).exec();
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username, deletedAt: null }).exec();
  }

  async getUserById(id: string): Promise<User & { profile?: Profile }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id), deletedAt: null })
      .populate('profileId')
      .exec();

    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.username = updateUserDto.username || user.username;
    user.email = updateUserDto.email || user.email;
    user.password = updateUserDto.password || user.password;

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    updateUserDto.updatedAt = new Date();
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id: id, deletedAt: null }, updateUserDto, {
        new: true,
      })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.profileId) {
      await this.profileModel
        .findOneAndUpdate(
          { _id: user.profileId, deletedAt: null },
          { deletedAt: new Date() },
          { new: true },
        )
        .exec();
    }
  }
}
