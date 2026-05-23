import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import styled from '@emotion/styled';
import { useLetterForm } from '@/domains/letters/hooks/useLetterForm';
import { useLetterHistory } from '@/domains/letters/hooks/useLetterHistory';
import { createLetter } from '@/domains/letters/api/letters';
import { ErrorDialog } from '@/components/ErrorDialog';

const MAX_CONTENT_LENGTH = 5000;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const LINE_HEIGHT_PX = 38;
const NOTEBOOK_MARGIN_PX = 44;

const C = {
  brown: '#2C1A10',
  rust: '#B5503A',
  rustHover: '#9E4430',
  muted: '#9B8B78',
  inputBorder: '#C0B4A0',
  notebookBg: '#FBF7F2',
  notebookLine: '#DDD4C4',
  notebookMarginBg: '#F0E8DC',
  notebookMarginLine: '#D4B8A8',
  error: '#C0392B',
} as const;

function formatSendDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})에 도착해요`;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${C.brown};
`;

const RequiredMark = styled.span`
  color: ${C.rust};
  margin-left: 0.2rem;
  font-size: 0.875rem;
`;

const CharCount = styled.span<{ $isNearLimit: boolean }>`
  font-size: 0.8125rem;
  color: ${({ $isNearLimit }) => ($isNearLimit ? C.error : C.muted)};
`;

const BottomBorderInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid ${C.inputBorder};
  padding: 0.625rem 0;
  font-size: 1rem;
  font-family: 'Gaegu', cursive;
  color: ${C.brown};
  outline: none;
  letter-spacing: 0.04em;

  &::placeholder {
    color: ${C.muted};
    font-family: 'Gaegu', cursive;
  }

  &:focus {
    border-bottom-color: ${C.brown};
  }
`;

const BottomBorderEmailInput = styled(BottomBorderInput)`
  font-family: 'Noto Serif KR', serif;
  font-size: 0.9375rem;
  letter-spacing: 0;

  &::placeholder {
    font-family: 'Noto Serif KR', serif;
  }
`;

const NotebookTextarea = styled.textarea`
  width: 100%;
  min-height: 380px;
  resize: none;
  border: 1.5px solid ${C.inputBorder};
  border-radius: 6px;
  font-family: 'Gaegu', cursive;
  font-size: 1rem;
  color: ${C.brown};
  line-height: ${LINE_HEIGHT_PX}px;
  padding: 8px 16px 8px ${NOTEBOOK_MARGIN_PX + 12}px;
  outline: none;

  background-color: ${C.notebookBg};
  background-image:
    linear-gradient(
      to right,
      ${C.notebookMarginBg} 0,
      ${C.notebookMarginBg} ${NOTEBOOK_MARGIN_PX - 1}px,
      ${C.notebookMarginLine} ${NOTEBOOK_MARGIN_PX - 1}px,
      ${C.notebookMarginLine} ${NOTEBOOK_MARGIN_PX}px,
      transparent ${NOTEBOOK_MARGIN_PX}px
    ),
    repeating-linear-gradient(
      transparent,
      transparent ${LINE_HEIGHT_PX - 1}px,
      ${C.notebookLine} ${LINE_HEIGHT_PX - 1}px,
      ${C.notebookLine} ${LINE_HEIGHT_PX}px
    );
  background-position: 0 8px, 0 8px;

  &::placeholder {
    color: ${C.muted};
  }

  &:focus {
    border-color: ${C.brown};
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1.5px solid ${C.inputBorder};
  border-radius: 8px;
  background: transparent;
  font-family: 'Noto Serif KR', serif;
  font-size: 1rem;
  color: ${C.brown};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${C.brown};
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0.5;
    cursor: pointer;
  }
`;

const DatePreview = styled.p`
  font-family: 'Gaegu', cursive;
  font-size: 0.9375rem;
  color: ${C.rust};
  letter-spacing: 0.02em;
`;

const ErrorMessage = styled.p`
  font-size: 0.8125rem;
  color: ${C.error};
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.0625rem;
  background: ${C.rust};
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-family: 'Noto Serif KR', serif;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    background: ${C.rustHover};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FooterNote = styled.p`
  font-size: 0.8125rem;
  color: ${C.muted};
  text-align: center;
  line-height: 1.9;
`;

export function LetterForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addLetter } = useLetterHistory();

  const methods = useLetterForm();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    minSendDate,
    maxSendDate,
  } = methods;

  const contentValue = watch('content') ?? '';
  const sendAtValue = watch('sendAt') ?? '';
  const isNearLimit = contentValue.length > MAX_CONTENT_LENGTH * 0.9;
  const formattedDate = sendAtValue ? formatSendDate(sendAtValue) : null;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await createLetter(data);
      addLetter({
        id: result.id,
        recipientName: data.recipientName,
        email: data.email,
        sendAt: data.sendAt,
        cancelToken: result.cancelToken,
        createdAt: new Date().toISOString(),
      });
      navigate('/done', {
        state: {
          sendAt: data.sendAt,
          email: data.email,
          recipientName: data.recipientName,
        },
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    }
  });

  return (
    <FormProvider {...methods}>
      <Form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <Label htmlFor="recipientName">받는 사람</Label>
          <BottomBorderInput
            id="recipientName"
            type="text"
            placeholder="미래의 나에게"
            maxLength={50}
            {...register('recipientName')}
          />
          {errors.recipientName && (
            <ErrorMessage>{errors.recipientName.message}</ErrorMessage>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="email">
            받을 이메일<RequiredMark>*</RequiredMark>
          </Label>
          <BottomBorderEmailInput
            id="email"
            type="email"
            placeholder="hello@example.com"
            {...register('email')}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </FieldGroup>

        <FieldGroup>
          <LabelRow>
            <Label htmlFor="content">
              편지 내용<RequiredMark>*</RequiredMark>
            </Label>
            <CharCount $isNearLimit={isNearLimit}>
              {contentValue.length}자
            </CharCount>
          </LabelRow>
          <NotebookTextarea
            id="content"
            placeholder="오늘의 마음을 적어보세요..."
            {...register('content')}
          />
          {errors.content && (
            <ErrorMessage>{errors.content.message}</ErrorMessage>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="sendAt">
            발송 날짜<RequiredMark>*</RequiredMark>
          </Label>
          <DateInput
            id="sendAt"
            type="date"
            min={minSendDate}
            max={maxSendDate}
            {...register('sendAt')}
          />
          {formattedDate && <DatePreview>{formattedDate}</DatePreview>}
          {errors.sendAt && (
            <ErrorMessage>{errors.sendAt.message}</ErrorMessage>
          )}
        </FieldGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '전송 중...' : '편지 보내기 →'}
        </SubmitButton>

        <FooterNote>
          전송 후 내용은 데이터베이스에서 영구히 삭제됩니다.<br />
          오직 당신의 메일함에만 도착해요.
        </FooterNote>
      </Form>

      {errorMessage && (
        <ErrorDialog
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
          onRetry={() => {
            setErrorMessage(null);
            onSubmit();
          }}
        />
      )}
    </FormProvider>
  );
}
