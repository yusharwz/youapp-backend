import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { MessageService } from '../service/message.service';
import { Message as MessageInterface } from '../model/message.schema';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { SendMessageDto } from '../model/dto/send-message.dto';
import { Profile } from '../../profile/model/profile.schema';
import { User } from '../../user/model/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Controller('api')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    @InjectModel(Profile.name) private readonly userModel: Model<User>,
  ) {}

  @Post('sendMessage')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Req() req: any, @Body() sendMessageDto: SendMessageDto) {
    const senderId = req.user.userId;
    return this.messageService.sendMessage(
      senderId,
      sendMessageDto.receiverId,
      sendMessageDto.content,
    );
  }

  @Get('viewMessage/:senderId')
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Req() req: any,
    @Param('senderId') senderId: string,
  ): Promise<MessageInterface[]> {
    const receiverId = req.user.userId;
    return this.messageService.getMessages(senderId, receiverId);
  }

  @Get('viewAllMessages')
  @UseGuards(JwtAuthGuard)
  async viewAllMessages(@Req() req: any) {
    const userId = req.user.userId;
    const displayNames =
      await this.messageService.getAllConnectedUserDisplayNames(userId);
    return displayNames;
  }
}
