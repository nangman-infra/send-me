import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { LettersModule } from './modules/letters/letters.module';
import { MailModule } from './modules/mail/mail.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { createOrmConfig } from './config/orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createOrmConfig,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    LettersModule,
    MailModule,
    SchedulerModule,
  ],
})
export class AppModule {}
