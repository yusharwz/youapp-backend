import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ default: null })
  displayName: string;

  @Prop({ default: null })
  gender: string;

  @Prop({ default: null })
  birthDate: Date;

  @Prop({ default: null })
  horoscope: string;

  @Prop({ default: null })
  zodiac: string;

  @Prop({ default: null })
  height: string;

  @Prop({ required: true })
  weight: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ type: [String], default: [] })
  interests: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
