import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { customOptions, options } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(process.env.APP_PORT || 3000);
  console.log(`Run: PORT: ${process.env.APP_PORT || 3000}`);
}
bootstrap();
