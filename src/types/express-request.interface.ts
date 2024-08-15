import { Request } from 'express';

export interface UserPayload {
  userId: string;
  username: string;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
}
