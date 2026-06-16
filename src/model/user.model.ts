import { UserDocument } from "../common/types/user.types";
import {model,Schema} from 'mongoose'

export const userSchema = new Schema<UserDocument>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        profileImage: { type: String, default: '' },
        dateOfBirth: { type: Date, required: true },
        password: { type: String, required: true },
        refreshToken: { type: String, default: '' },
        googleId: { type: String },
        role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
        isVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey:false
    }
);

export const UserModel = model<UserDocument>('User', userSchema);