import { Module } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
