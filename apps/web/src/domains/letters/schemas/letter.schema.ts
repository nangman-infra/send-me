import { z } from 'zod';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

const tenYearsLater = new Date();
tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);
tenYearsLater.setHours(23, 59, 59, 999);

export const letterSchema = z.object({
  recipientName: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .max(50, '50자 이내로 입력해주세요.'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  content: z
    .string()
    .min(10, '10자 이상 입력해주세요.')
    .max(5000, '5,000자 이내로 입력해주세요.'),
  sendAt: z.string().refine((val) => {
    const date = new Date(val);
    return date >= tomorrow && date <= tenYearsLater;
  }, '발송 날짜는 내일부터 10년 이내여야 합니다.'),
});

export type LetterFormValues = z.infer<typeof letterSchema>;
