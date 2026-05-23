import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type LetterStatus = 'pending' | 'sent' | 'cancelled';

@Entity('letters')
export class Letter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recipient_name', length: 50 })
  recipientName: string;

  @Column({ length: 255 })
  email: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Index('idx_letters_send_at_status')
  @Column({ name: 'send_at', type: 'date' })
  sendAt: string;

  @Index('idx_letters_cancel_token', { unique: true })
  @Column({ name: 'cancel_token', type: 'uuid', generated: 'uuid' })
  cancelToken: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: LetterStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt: Date | null;
}
