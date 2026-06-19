
import { Document,Types } from 'mongoose'

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  dateOfBirth: Date;
  password: string;
  refreshToken: string;
  googleId?: string;
  role: Types.ObjectId | string;
  isVerified: boolean;
  isDeleted:boolean;
  isActive:boolean;
  totalAiRequest:number,
  totalAiToken:number,
}