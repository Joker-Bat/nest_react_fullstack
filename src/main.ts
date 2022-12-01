import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(
        cookieSession({
            keys: ['encryptCookieWithThisKey'],
        }),
    );

    app.useGlobalPipes(
        new ValidationPipe({
            // It will remove extra fields send in request other then we are expecting
            whitelist: true,
        }),
    );
    await app.listen(3000);
}
bootstrap();
