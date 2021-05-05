import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/kawaiineko.pl/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/kawaiineko.pl/fullchain.pem'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  }); 

  app.enableCors();

  await app.listen(process.env.port);

}
bootstrap();
