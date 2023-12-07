import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS_DOMAINS } from './constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule,  { cors: false });
  const corsOptions = { origin: CORS_DOMAINS, credentials: true }
  app.enableCors(corsOptions)
  await app.listen(3001);
}
bootstrap();
