// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from "bcryptjs"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const isProd = config.get('NODE_ENV') === 'production';

  // Serve uploaded images
  app.useStaticAssets(join(__dirname, '..', 'images'));

  // 🔐 Security headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    })
  );
  app.set('trust proxy', 1);

  // CORS
  app.enableCors({
    origin: "",
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token'
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
    })
  );

  // Cookie parser for CSRF
  app.use(cookieParser());

  // Validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global API prefix
  app.setGlobalPrefix('api');

  

  await app.listen(config.get('PORT') || 8000, '0.0.0.0');
  const hashed = await bcrypt.hash("123456789", 12);

  console.log(hashed);
  console.log(`Secure API running on http://localhost:${config.get('PORT')}`);
}
bootstrap();
