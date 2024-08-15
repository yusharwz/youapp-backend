import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  readonly receiverId: string;

  @IsString()
  readonly content: string;
}
