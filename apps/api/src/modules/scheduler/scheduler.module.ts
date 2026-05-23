import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { LettersModule } from '../letters/letters.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [LettersModule, MailModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
