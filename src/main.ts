import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { customOptions, options } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const corsOrigin = process.env.CORS_ORIGIN?.split(',');
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  app.setViewEngine('hbs');

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(process.env.APP_PORT || 3000);
  console.log(`Run: PORT  : ${process.env.APP_PORT || 3000}`);
}
bootstrap();
