import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
const cookieSession = require('cookie-session');

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
      exclude: ['/api/*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (process.env.NODE_ENV === 'production') {
          return {
            type: 'mysql',
            host: process.env.MYSQLHOST,
            port: parseInt(process.env.MYSQLPORT, 10),
            username: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE,
            entities: [User, Report],
          };
        } else {
          return {
            type: 'mysql',
            host: config.get('DB_HOST'),
            port: parseInt(config.get('DB_PORT'), 10),
            username: config.get('DB_USERNAME'),
            password: config.get('DB_PASSWORD'),
            database: config.get('DB_NAME'),
            entities: [User, Report],
            synchronize: true,
          };
        }
      },
    }),
    // TypeOrmModule.forRoot({
    //     type: 'sqlite',
    //     database: 'db.sqlite',
    //     entities: [User, Report],
    //     synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // It will remove extra fields send in request other then we are expecting
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          name: 'session',
          keys: [
            process.env.NODE_ENV === 'production'
              ? process.env.COOKIE_KEY
              : this.configService.get('COOKIE_KEY'),
          ],
          maxAge: 1000 * 60 * 60,
        }),
      )
      .forRoutes('*');
  }
}
