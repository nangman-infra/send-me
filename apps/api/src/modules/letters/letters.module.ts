import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './letters.entity';
import { LettersRepository } from './letters.repository';
import { LettersService } from './letters.service';
import { LettersController } from './letters.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Letter]), MailModule],
  controllers: [LettersController],
  providers: [
    LettersService,
    {
      provide: 'ILettersRepository',
      useClass: LettersRepository,
    },
    LettersRepository,
  ],
  exports: [LettersService, 'ILettersRepository', LettersRepository],
})
export class LettersModule {}
