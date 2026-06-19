import { UserDocument } from "../common/types/user.types";
import {model,Schema} from 'mongoose'

export const userSchema = new Schema<UserDocument>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        profileImage: { type: String, default: '' },
        dateOfBirth: { type: Date, required: true },
        password: { type: String, required: true },
        refreshToken: { type: String, default: '' },
        role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
        totalAiRequest:{type:Number,default:0},
        totalAiToken:{type:Number,default:0},
        isDeleted:{type:Boolean,default:false},
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey:false
    }
);

userSchema.index({email:1},{unique:true,partialFilterExpression:{isDeleted:false}})
userSchema.index({firstName:1,lastName:1})
export const UserModel = model<UserDocument>('User', userSchema);