import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { letterSchema, type LetterFormValues } from '@/domains/letters/schemas/letter.schema';

const MIN_SEND_DATE_OFFSET_DAYS = 1;

function getMinSendDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + MIN_SEND_DATE_OFFSET_DAYS);
  return date.toISOString().split('T')[0];
}

function getMaxSendDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 10);
  return date.toISOString().split('T')[0];
}

export function useLetterForm() {
  const methods = useForm<LetterFormValues>({
    resolver: zodResolver(letterSchema),
    defaultValues: {
      recipientName: '',
      email: '',
      content: '',
      sendAt: '',
    },
    mode: 'onBlur',
  });

  return {
    ...methods,
    minSendDate: getMinSendDate(),
    maxSendDate: getMaxSendDate(),
  };
}
