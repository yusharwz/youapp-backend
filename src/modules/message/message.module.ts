import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageGateway } from './gateway/message.gateway';
import { MessageService } from './service/message.service';
import { MessageSchema } from './model/message.schema';
import { MessageController } from './controller/message.controller';
import { ProfileModule } from '../profile/profile.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    ProfileModule,
    UserModule,
  ],
  controllers: [MessageController],
  exports: [MessageService],
  providers: [MessageService, MessageGateway, MessageController],
})
export class MessageModule {}
