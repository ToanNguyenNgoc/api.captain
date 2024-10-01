import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'database/database.config';
import { ApiModule } from './api/api.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as sendGridTransport from 'nodemailer-sendgrid-transport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ApiModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: sendGridTransport({
          auth: {
            api_key: String(process.env.MAIL_GRID_API_KEY),
          },
        }),
        defaults: {
          from: '"No Reply" <no-reply@example.com>',
        },
        template: {
          dir: __dirname + '/templates', // Adjust this to the correct path for your templates
          adapter: new HandlebarsAdapter(), // or another adapter like Pug, EJS, etc.
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
