import { UsersService } from './users.service';
import { Body, Controller, Get, Req, Res, Post } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('postAddress')
  async postAddress(@Req() req: Request, @Res() res: Response): Promise<any[]> {
    return await this.userService.postAddress(req, res);
  }
  @Post('postPublicKeyRaw')
  async postPublicKeyRaw(@Req() req: Request, @Res() res: Response): Promise<any[]> {
    return await this.userService.postPublicKeyRaw(req, res);
  }

  @Post('postSigAndBlockhash')
  async postSigAndBlockhash(@Req() req: Request, @Res() res: Response): Promise<any[]> {
    return await this.userService.postSigAndBlockhash(req, res);
  }
  @Post('postBlockNumber')
  async postBlockNumber(@Req() req: Request, @Res() res: Response): Promise<any[]> {
    return await this.userService.postBlockNumber(req, res);
  }

  @Post('getMintAndTransferInfo')
  async getMintAndTransferInfo(@Req() req: Request, @Res() res: Response): Promise<any[]> {
    return await this.userService.getMintAndTransferInfo(req, res)
  }

  @Post('getStatus')
  async getStatus(@Req() req: Request, @Res() res: Response): Promise<any[]> {
    return await this.userService.getStatus(req, res)
  }

}
