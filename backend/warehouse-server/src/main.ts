import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  const isDev = process.env.NODE_ENV === 'development';

  const devAllowedOrigins = process.env.DEV_ALLOWED_ORIGINS?.split(',') ?? [];

  const prodAllowedOrigins = process.env.PROD_ALLOWED_ORIGINS?.split(',') ?? [];

  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      // Dev mode
      if (isDev && devAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Prod mode
      if (!isDev && prodAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'X-Client-Identifier',
    ],
    exposedHeaders: ['X-Client-Identifier'],
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Warehouse API')
    .setDescription('The warehouse API description')
    .setVersion('1.0')
    .addTag('warehouse')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Filters and pipes
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Use AWS elstaic beamstack assigned port (8080 by default)
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Server running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
  process.exit(1);
});
