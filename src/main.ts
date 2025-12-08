import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from './config/constants';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { join } from 'path';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { PaginationQueryDto } from './common/utils/pagination-query.dto';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Nest + PostgreSQL + Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config, {
    extraModels: [PaginationQueryDto],
  });
  SwaggerModule.setup('docs', app, doc);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpErrorFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });

  await app.listen(env.port);
  console.log(`🚀 Server is running on http://localhost:${env.port}`);

}
bootstrap();
