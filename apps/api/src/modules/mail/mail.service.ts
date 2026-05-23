import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Letter } from '../letters/letters.entity';

const MONTHS_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'] as const;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendConfirmation(letter: Letter, appUrl: string): Promise<void> {
    const cancelUrl = `${appUrl}/cancel/${letter.cancelToken}`;
    const sendAtFormatted = this.formatKoreanDate(letter.sendAt);

    await this.transporter.sendMail({
      from: this.configService.get<string>('MAIL_FROM'),
      to: letter.email,
      subject: `[미래에 보내는 편지] ${sendAtFormatted}에 편지가 발송됩니다`,
      html: this.buildConfirmationHtml({ letter, cancelUrl, sendAtFormatted }),
    });
  }

  async sendLetter(letter: Letter): Promise<void> {
    if (!letter.content) return;

    await this.transporter.sendMail({
      from: `Future Letter <${this.configService.get<string>('MAIL_USER')}>`,
      to: letter.email,
      subject: `${letter.recipientName} — 어제의 나로부터`,
      html: this.buildLetterHtml(letter),
    });
  }

  private formatKoreanDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  private getPostmark(sendAt: string): { day: string; month: string; year: number } {
    const date = new Date(sendAt + 'T00:00:00');
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: MONTHS_EN[date.getMonth()],
      year: date.getFullYear(),
    };
  }

  private calcDaysElapsed(createdAt: Date, sendAt: string): number {
    const sentDate = new Date(sendAt + 'T00:00:00');
    return Math.round((sentDate.getTime() - createdAt.getTime()) / MS_PER_DAY);
  }

  private buildParagraphs(content: string): string {
    const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
    if (paragraphs.length === 0) return '';

    return paragraphs
      .map((para, idx) => {
        const html = para.trim().replace(/\n/g, '<br>');
        const borderTop = idx > 0 ? 'border-top:1px solid #EDE6DC;' : '';
        const paddingTop = idx > 0 ? 'padding-top:18px;' : '';
        return `
          <div style="${borderTop}${paddingTop}margin-bottom:18px;">
            <p style="font-family:'Gaegu',cursive;font-size:16px;line-height:1.9;color:#2C1A10;margin:0;">${html}</p>
          </div>`;
      })
      .join('');
  }

  private buildLetterHtml(letter: Letter): string {
    const writtenDate = this.formatKoreanDate(letter.createdAt.toISOString().split('T')[0]);
    const deliveryDate = this.formatKoreanDate(letter.sendAt);
    const postmark = this.getPostmark(letter.sendAt);
    const daysElapsed = this.calcDaysElapsed(letter.createdAt, letter.sendAt);
    const paragraphsHtml = this.buildParagraphs(letter.content ?? '');

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:20px 12px;background-color:#F2EDE4;font-family:Georgia,'Noto Serif KR',serif;">
  <div style="max-width:560px;margin:0 auto;">

    <!-- 편지 카드 -->
    <div style="background:#FDFAF6;border-radius:16px;padding:28px 24px 72px;position:relative;box-shadow:0 4px 20px rgba(100,70,40,0.12);">

      <!-- 소인 스탬프 (우상단) -->
      <div style="position:absolute;top:-10px;right:18px;width:84px;height:84px;border-radius:50%;border:2px solid rgba(181,80,58,0.65);background:rgba(240,228,214,0.88);text-align:center;transform:rotate(12deg);padding-top:16px;box-sizing:border-box;">
        <div style="font-size:7px;letter-spacing:0.12em;color:#B5503A;font-weight:700;margin-bottom:2px;">SEND BY</div>
        <div style="font-size:15px;font-weight:700;color:#B5503A;line-height:1.1;">${postmark.day} ${postmark.month}</div>
        <div style="font-size:8px;color:#B5503A;margin-top:2px;">${postmark.year}</div>
      </div>

      <!-- WRITTEN ON -->
      <p style="font-size:9px;letter-spacing:0.28em;color:#9B8B78;text-transform:uppercase;margin:0 0 6px;">Written On</p>
      <p style="font-family:'Gaegu',cursive;font-size:20px;color:#B5503A;letter-spacing:0.05em;margin:0 0 22px;">${writtenDate}</p>

      <!-- 수신자 -->
      <p style="font-family:'Gaegu',cursive;font-size:18px;color:#2C1A10;letter-spacing:0.08em;margin:0 0 22px;">${letter.recipientName}</p>

      <!-- 편지 내용 -->
      ${paragraphsHtml}

      <!-- 서명 -->
      <p style="font-family:'Gaegu',cursive;font-size:16px;color:#9B8B78;margin:20px 0 0;">— 어제의 나로부터</p>

      <!-- 왁스씰 (우하단) -->
      <div style="position:absolute;bottom:16px;right:16px;width:48px;height:48px;background:#8B3A2A;border-radius:50%;border:2px solid #6E2418;box-shadow:0 3px 10px rgba(0,0,0,0.25);text-align:center;line-height:44px;">
        <span style="font-family:Georgia,serif;font-style:italic;font-weight:700;color:rgba(255,255,255,0.92);font-size:20px;">f</span>
      </div>
    </div>

    <!-- 하단 정보 카드 -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F2;border-radius:12px;margin-top:12px;">
      <tr>
        <td style="padding:16px 18px;" valign="top" width="32">
          <span style="font-size:20px;">🕐</span>
        </td>
        <td style="padding:16px 18px 16px 0;" valign="top">
          <p style="font-family:'Gaegu',cursive;font-size:16px;color:#2C1A10;margin:0 0 4px;">${daysElapsed}일 전의 당신이 보냈어요</p>
          <p style="font-size:12px;color:#9B8B78;margin:0;">${writtenDate} 발송 · ${deliveryDate} 도착</p>
        </td>
      </tr>
    </table>

  </div>
</body>
</html>`;
  }

  private buildConfirmationHtml({
    letter,
    cancelUrl,
    sendAtFormatted,
  }: {
    letter: Letter;
    cancelUrl: string;
    sendAtFormatted: string;
  }): string {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:20px 12px;background-color:#F2EDE4;font-family:Georgia,serif;">
  <div style="max-width:480px;margin:0 auto;background:#FDFAF6;border-radius:16px;padding:28px 24px;box-shadow:0 4px 20px rgba(100,70,40,0.10);">
    <p style="font-size:9px;letter-spacing:0.28em;color:#9B8B78;text-transform:uppercase;margin:0 0 8px;">Future Letter</p>
    <h2 style="font-size:22px;color:#2C1A10;margin:0 0 16px;font-weight:700;">편지가 안전하게 보관되었습니다</h2>
    <p style="font-size:15px;color:#6B6B6B;line-height:1.8;margin:0 0 8px;">
      <strong>${letter.recipientName}</strong>님께 보내는 편지가<br>
      <strong style="color:#B5503A;">${sendAtFormatted}</strong>에 발송될 예정입니다.
    </p>
    <p style="font-size:14px;color:#9B8B78;margin:0 0 24px;">발송 전날 23:59까지 취소할 수 있습니다.</p>
    <a href="${cancelUrl}" style="display:inline-block;padding:12px 24px;background:#B5503A;color:#fff;text-decoration:none;border-radius:9999px;font-size:15px;font-weight:700;">편지 취소하기</a>
    <p style="font-size:12px;color:#9B8B78;margin-top:24px;">이 메일은 자동으로 발송되었습니다. 답장하지 마세요.</p>
  </div>
</body>
</html>`;
  }
}
