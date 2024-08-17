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
    if (
      !receiverId ||
      receiverId === "" ||
      receiverId === null ||
      receiverId === "null"
    ) {
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

  async getMessages(userId: string, receiverId: string): Promise<any[]> {
    if (userId === receiverId) {
      throw new BadRequestException(
        "Cannot retrieve messages between yourself"
      );
    }

    const messages = await this.messageModel
      .find({
        $or: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      })
      .exec();

    const userIds = messages.reduce((acc, message) => {
      acc.add(message.senderId.toString());
      acc.add(message.receiverId.toString());
      return acc;
    }, new Set<string>());

    const users = await this.userModel
      .find({ _id: { $in: Array.from(userIds) } })
      .select("username")
      .exec();

    const userMap: Record<string, string> = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = user.username;
    });

    const formattedMessages = messages.map((message) => ({
      _id: message._id,
      senderId: message.senderId,
      senderUsername: userMap[message.senderId.toString()],
      receiverId: message.receiverId,
      receiverUsername: userMap[message.receiverId.toString()],
      content: message.content,
      timestamp: message.timestamp,
    }));

    return formattedMessages;
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
