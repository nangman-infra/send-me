import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { ILettersRepository } from '../letters/letters.repository';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SchedulerService {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepository: ILettersRepository,
    private readonly mailService: MailService,
  ) {}

  @Cron('0 0 9 * * *', { timeZone: 'Asia/Seoul' })
  async sendScheduledLetters(): Promise<void> {
    const TODAY = new Date().toISOString().split('T')[0];
    const letters = await this.lettersRepository.findPendingByDate(TODAY);

    for (const letter of letters) {
      try {
        await this.mailService.sendLetter(letter);
        await this.lettersRepository.markAsSent(letter.id);
      } catch (error) {
        console.error(`[Scheduler] 발송 실패 letterId=${letter.id}`, error);
      }
    }
  }
}
