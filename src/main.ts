import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            // It will remove extra fields send in request other then we are expecting
            whitelist: true,
        }),
    );
    await app.listen(3000);
}
bootstrap();
