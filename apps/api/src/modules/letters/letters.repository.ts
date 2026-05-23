import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letter } from './letters.entity';

export interface ILettersRepository {
  create(data: Omit<Letter, 'id' | 'cancelToken' | 'status' | 'createdAt' | 'sentAt' | 'content'> & { content: string }): Promise<Letter>;
  findByCancelToken(cancelToken: string): Promise<Letter | null>;
  findPendingByDate(date: string): Promise<Letter[]>;
  countByEmailToday(email: string, date: string): Promise<number>;
  markAsSent(id: string): Promise<void>;
  markAsCancelled(id: string): Promise<void>;
}

@Injectable()
export class LettersRepository implements ILettersRepository {
  constructor(
    @InjectRepository(Letter)
    private readonly repo: Repository<Letter>,
  ) {}

  async create(data: Omit<Letter, 'id' | 'cancelToken' | 'status' | 'createdAt' | 'sentAt' | 'content'> & { content: string }): Promise<Letter> {
    const letter = this.repo.create(data);
    return this.repo.save(letter);
  }

  async findByCancelToken(cancelToken: string): Promise<Letter | null> {
    return this.repo.findOne({ where: { cancelToken } });
  }

  async findPendingByDate(date: string): Promise<Letter[]> {
    return this.repo
      .createQueryBuilder('letter')
      .where('letter.send_at = :date', { date })
      .andWhere('letter.status = :status', { status: 'pending' })
      .getMany();
  }

  async countByEmailToday(email: string, date: string): Promise<number> {
    return this.repo.count({
      where: {
        email,
        sendAt: date,
        status: 'pending',
      },
    });
  }

  async markAsSent(id: string): Promise<void> {
    await this.repo.update(id, {
      status: 'sent',
      content: null,
      sentAt: new Date(),
    });
  }

  async markAsCancelled(id: string): Promise<void> {
    await this.repo.update(id, { status: 'cancelled' });
  }
}
