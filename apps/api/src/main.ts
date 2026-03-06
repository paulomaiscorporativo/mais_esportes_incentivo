import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: true, // Allow all origins for MVP
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    app.useGlobalFilters(new AllExceptionsFilter());

    const port = process.env.PORT || 3005;
    await app.listen(port);

    logger.log(`API is running on: http://localhost:${port}`);
}
bootstrap();
