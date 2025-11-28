import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from './config/constants';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Nest + PostgreSQL + Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // forbidUnknownValues: true,
    }),
  );

  app.useGlobalFilters(new HttpErrorFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(env.port);
}
bootstrap();
