import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { IUser, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { Request, Response } from 'express';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  // POSTS
  async postAddress(req: Request, res: Response): Promise<any> {
    const userAddress = req.body.userAddress
    
    let userDb = await this.userModel.findOne({ ethereum: userAddress })
    
    
    if (userDb) {
      console.log(userDb)
      throw new HttpException({ message: 'Address for User ID Already exists' }, HttpStatus.CONFLICT)
    }

    const user = new this.userModel({
      ethereum: userAddress
    });
    
    try {
      await user.save();
      return res.status(HttpStatus.CREATED).json({ user})
    } catch (error) {
      throw new HttpException({ message: 'Error while creating User ID' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postPublicKeyRaw(req: Request, res: Response): Promise<any> {
    const userAddress = req.body.userAddress
    const primaryPublicKeyRaw = req.body.primaryPublicKeyRaw
   
    let userDb = await this.userModel.findOne({ ethereum: userAddress })
    console.log(userDb)

    if (userDb) {
      userDb.set({ publicKeyRaw: primaryPublicKeyRaw })
      try {
        await userDb.save();
        return res.status(HttpStatus.CREATED).json({ message: "Sucesfully saved"})
      } catch (error) {
        throw new HttpException({ message: 'Error while saving publicKeyRaw' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException("User doesn't exist or token was ", HttpStatus.NOT_FOUND);
    }
  }

  async postSigAndBlockhash(req: Request, res: Response): Promise<any> {
    const userAddress = req.body.userAddress;
    let userDb = await this.userModel.findOne({ ethereum: userAddress });
  
    const signatureFromChip = req.body.signature;
    const blockHashUsedInSig = req.body.blockhash;

    const dataChip = {
      signatureFromChip: signatureFromChip,
      blockHashUsedInSig: blockHashUsedInSig,
      finishedMobile: true, // Set finishMobile to true
    };
  
    if (userDb && signatureFromChip && blockHashUsedInSig) {
      userDb.set({ ...dataChip });
  
      try {
        await userDb.save();
        return res.status(HttpStatus.CREATED).json({ message: 'Signature, Blockhash, and finishMobile status saved'})
      } catch (error) {
        throw new HttpException({ message: 'Error while saving Signature and Blockhash' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
    }
  }

  async postBlockNumber(req: Request, res: Response): Promise<any> {
    const userAddress = req.body.address;
    let userDb = await this.userModel.findOne({ ethereum: userAddress });
    console.log(userDb)
    console.log(req.body)
    const blockNumber = req.body.blockNumber;
    console.log(blockNumber)
    const blockNumberToInt2 = parseInt(blockNumber, 10);
    console.log(blockNumberToInt2)
    const blockNumberToInt = Number(blockNumber)
    console.log(blockNumberToInt)

    if (userDb) {
      userDb.set({ blockNumber: blockNumber});
      
  
      try {
        await userDb.save();
        console.log(userDb)
        return res.status(HttpStatus.CREATED).json({ message: 'Blocknumber status saved'})
      } catch (error) {
        throw new HttpException({ message: 'Error while saving Signature and Blockhash' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
    }
  }


  // GET
  async getStatus(req: Request, res: Response): Promise<any> {
    const userAddress = req.body.userAddress
    let userDb = await this.userModel.findOne({ ethereum: userAddress, finishedMobile: true })
    if (userDb) {
      return res.status(HttpStatus.CREATED).json({ message: userDb.finishedMobile})
    } else {
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND)
    }
  }

  async getMintAndTransferInfo(req: Request, res: Response): Promise<any> {
    const userAddress = req.body.userAddress
    let userDb = await this.userModel.findOne({ ethereum: userAddress })
   
    if (userDb) {
      const mintAndTRansferInfo = {
        signatureFromChip: userDb.signatureFromChip,
        blockNumber: userDb.blockNumber
      }
      return res.status(HttpStatus.OK).json({ message: mintAndTRansferInfo})
    } else {
      throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND)
    }
  }
}
