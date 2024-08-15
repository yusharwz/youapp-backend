import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "../model/message.schema";
import { User } from "../../user/model/user.schema";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel("Message") private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<Message> {
    if (!receiverId) {
      throw new BadRequestException("Receiver ID is undefined");
    }
    if (receiverId === senderId) {
      throw new BadRequestException("Cannot send message to yourself");
    }
    if (!content || content.trim() === "") {
      throw new BadRequestException("Message content cannot be empty");
    }

    return new this.messageModel({
      senderId,
      receiverId,
      content,
      timestamp: Date.now(),
    }).save();
  }

  async getMessages(userId: string, receiverId: string): Promise<Message[]> {
    if (userId === receiverId) {
      throw new BadRequestException(
        "Cannot retrieve messages between yourself"
      );
    }
    return this.messageModel
      .find({
        $or: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      })
      .exec();
  }

  async getAllConnectedUserUsernames(userId: string): Promise<any[]> {
    const connectedUserIds = await this.getAllChatRooms(userId);

    const users = await this.userModel
      .find({ _id: { $in: connectedUserIds } })
      .select("username _id")
      .exec();

    if (users.length === 0) {
      return [];
    }

    const userDetails = users.map((user) => ({
      userId: user._id,
      username: user.username,
    }));

    return userDetails;
  }

  async getAllChatRooms(userId: string): Promise<string[]> {
    const senderIds = await this.messageModel
      .find({ senderId: userId })
      .distinct("receiverId")
      .exec();

    const receiverIds = await this.messageModel
      .find({ receiverId: userId })
      .distinct("senderId")
      .exec();

    const allChatRoomIds = [...new Set([...senderIds, ...receiverIds])];

    return allChatRoomIds;
  }
}
