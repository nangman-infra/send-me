import type { LetterFormValues } from '@/domains/letters/schemas/letter.schema';

const API_URL = import.meta.env.VITE_API_URL;

export async function createLetter(data: LetterFormValues): Promise<{ id: string; cancelToken: string }> {
  const res = await fetch(`${API_URL}/api/v1/letters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error?.message ?? '편지 저장 중 오류가 발생했습니다.');
  }
  const json = await res.json();
  return json.data;
}

export type CancelStatusResponse =
  | { status: 'cancellable'; recipientName: string; sendAt: string }
  | { status: 'sent' | 'cancelled' };

export async function getCancelStatus(token: string): Promise<CancelStatusResponse> {
  const res = await fetch(`${API_URL}/api/v1/letters/cancel/${token}`);
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error?.message ?? '상태 확인 중 오류가 발생했습니다.');
  }
  const json = await res.json();
  return json.data;
}

export async function cancelLetter(token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/letters/cancel/${token}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json?.error?.message ?? '취소 중 오류가 발생했습니다.');
  }
}
