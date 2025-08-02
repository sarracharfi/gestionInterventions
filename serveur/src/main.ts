import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuration du préfixe global
  app.setGlobalPrefix('api');

  // Configuration CORS améliorée
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Plusieurs origines possibles
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Configuration des fichiers statiques
  const uploadsDir = join(__dirname, '..', 'uploads');
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
    index: false,
    setHeaders: (res) => {
      res.set('X-Content-Type-Options', 'nosniff');
    },
  });

  // Validation globale
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Démarrer l'application
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Logger amélioré
  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Serving static files from: ${uploadsDir}`);
}

bootstrap().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});