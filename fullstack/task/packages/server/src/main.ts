import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestApplication>(AppModule);

    app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: false }));

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.enableCors({
        origin: 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
    });

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');
    console.log('App started on port', port);
    const host = '0.0.0.0';

    await app.listen(port, host);
}

bootstrap();
