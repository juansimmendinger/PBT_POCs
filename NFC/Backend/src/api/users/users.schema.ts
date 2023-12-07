import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  ethereum: string;
  signatureFromChip: string;
  blockHashUsedInSig: string;
  blockNumber: number;
  publicKeyRaw: string;
  finishedMobile: boolean;
}

export const UserSchema = new mongoose.Schema<IUser>({
  ethereum: {
    type: String,
  },
  signatureFromChip: {
    type: String,
  },
  blockHashUsedInSig: {
    type: String,
  },
  blockNumber: {
    type: Number,
  },
  publicKeyRaw: {
    type: String,
  },
  finishedMobile: {
    type: Boolean,
    default: false,
  },
});

export const UserModel = mongoose.model('User', UserSchema);
export type UserDocument = IUser & Document;
