import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ILettersRepository } from './letters.repository';
import type { CreateLetterDto } from './dto/create-letter.dto';
import { MailService } from '../mail/mail.service';

const MAX_LETTERS_PER_EMAIL_PER_DAY = 5;
const MIN_SEND_OFFSET_DAYS = 1;
const MAX_SEND_OFFSET_YEARS = 10;

@Injectable()
export class LettersService {
  constructor(
    @Inject('ILettersRepository')
    private readonly lettersRepository: ILettersRepository,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async createLetter(dto: CreateLetterDto): Promise<{ id: string; cancelToken: string }> {
    this.validateSendAt(dto.sendAt);

    const today = new Date().toISOString().split('T')[0];
    const dailyCount = await this.lettersRepository.countByEmailToday(dto.email, today);
    const hasReachedDailyLimit = dailyCount >= MAX_LETTERS_PER_EMAIL_PER_DAY;
    if (hasReachedDailyLimit) {
      throw new BadRequestException('하루 최대 5건까지만 작성할 수 있습니다.');
    }

    const letter = await this.lettersRepository.create({
      recipientName: dto.recipientName,
      email: dto.email,
      content: dto.content,
      sendAt: dto.sendAt,
    });

    const appUrl = this.configService.get<string>('APP_URL') ?? '';
    try {
      await this.mailService.sendConfirmation(letter, appUrl);
    } catch (error) {
      console.warn(`[LettersService] 확인 메일 발송 실패 letterId=${letter.id}`, error);
    }

    return { id: letter.id, cancelToken: letter.cancelToken };
  }

  async getCancelStatus(
    cancelToken: string,
  ): Promise<
    | { status: 'cancellable'; recipientName: string; sendAt: string }
    | { status: 'sent' | 'cancelled' }
  > {
    const letter = await this.lettersRepository.findByCancelToken(cancelToken);
    if (!letter) {
      throw new NotFoundException('편지를 찾을 수 없습니다.');
    }

    if (letter.status === 'sent') return { status: 'sent' };
    if (letter.status === 'cancelled') return { status: 'cancelled' };

    const isCancellable = this.isCancellableToday(letter.sendAt);
    if (isCancellable) {
      return { status: 'cancellable', recipientName: letter.recipientName, sendAt: letter.sendAt };
    }
    return { status: 'sent' };
  }

  async cancelLetter(cancelToken: string): Promise<void> {
    const letter = await this.lettersRepository.findByCancelToken(cancelToken);
    if (!letter) {
      throw new NotFoundException('편지를 찾을 수 없습니다.');
    }

    if (letter.status !== 'pending') {
      throw new BadRequestException('취소할 수 없는 편지입니다.');
    }

    const isCancellable = this.isCancellableToday(letter.sendAt);
    if (!isCancellable) {
      throw new BadRequestException('발송 당일에는 취소할 수 없습니다.');
    }

    await this.lettersRepository.markAsCancelled(letter.id);
  }

  private validateSendAt(sendAt: string): void {
    const sendDate = new Date(sendAt);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + MIN_SEND_OFFSET_DAYS);
    tomorrow.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + MAX_SEND_OFFSET_YEARS);

    const isTooEarly = sendDate < tomorrow;
    const isTooLate = sendDate > maxDate;

    if (isTooEarly || isTooLate) {
      throw new BadRequestException('발송 날짜는 내일부터 10년 이내여야 합니다.');
    }
  }

  private isCancellableToday(sendAt: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return sendAt > today;
  }
}
