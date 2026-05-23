import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { getCancelStatus, cancelLetter } from '@/domains/letters/api/letters';
import type { CancelStatusResponse } from '@/domains/letters/api/letters';

const MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;

type PageStatus = 'loading' | 'cancellable' | 'sent' | 'cancelled' | 'error';

const C = {
  bg: '#F2EDE4',
  brown: '#2C1A10',
  rust: '#B5503A',
  muted: '#9B8B78',
  cardBg: '#FDFAF6',
  envelopeBody: '#CEC0A0',
  envelopeFlap: '#BDB090',
  inputBorder: '#C0B4A0',
} as const;

function formatKoreanDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function getPostmark(dateStr: string): { day: string; month: string; year: number } {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: MONTHS_EN[date.getMonth()],
    year: date.getFullYear(),
  };
}

/* ── Layout ─────────────────────────────────────────────── */

const Page = styled.main`
  min-height: 100dvh;
  background: ${C.bg};
  display: flex;
  flex-direction: column;
  padding: 3rem 1.5rem 2.5rem;
`;

const TopContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BrandLabel = styled.p`
  font-size: 0.6875rem;
  letter-spacing: 0.3em;
  color: ${C.rust};
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Gaegu', cursive;
  font-size: clamp(2rem, 8vw, 2.5rem);
  font-weight: 700;
  color: ${C.brown};
  letter-spacing: 0.08em;
  text-align: center;
  line-height: 1.35;
  margin-bottom: 2rem;
  white-space: pre-line;
`;

const Description = styled.p`
  font-size: 0.9375rem;
  color: ${C.muted};
  text-align: center;
  line-height: 1.9;
  margin-bottom: 2rem;
`;

/* ── Letter Card (Cancellable) ───────────────────────────── */

const LetterCard = styled.div`
  background: ${C.cardBg};
  border-radius: 14px;
  padding: 1.25rem 1.25rem 1.5rem;
  position: relative;
  box-shadow: 0 2px 12px rgba(100, 70, 40, 0.08);
  margin-bottom: 1.5rem;
`;

const CardLabel = styled.p`
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: ${C.muted};
  text-transform: uppercase;
  margin-bottom: 1.25rem;
`;

const PostmarkCircle = styled.div`
  position: absolute;
  top: -8px;
  right: 14px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 2px dashed rgba(181, 80, 58, 0.55);
  background: rgba(240, 228, 214, 0.88);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  transform: rotate(12deg);
`;

const PostmarkSentBy = styled.span`
  font-size: 0.4rem;
  letter-spacing: 0.14em;
  color: ${C.rust};
  font-weight: 700;
  text-transform: uppercase;
`;

const PostmarkDate = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${C.rust};
  line-height: 1.1;
  text-align: center;
`;

const PostmarkYear = styled.span`
  font-size: 0.4rem;
  color: ${C.rust};
  letter-spacing: 0.1em;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid #EDE6DC;

  &:last-of-type {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${C.muted};
  flex-shrink: 0;
  width: 4.5rem;
`;

const InfoValue = styled.span`
  font-family: 'Gaegu', cursive;
  font-size: 1rem;
  color: ${C.brown};
  letter-spacing: 0.04em;
`;

const InfoValueRust = styled(InfoValue)`
  color: ${C.rust};
  font-weight: 700;
`;

const WarningText = styled.p`
  font-size: 0.875rem;
  color: ${C.muted};
  text-align: center;
  line-height: 1.75;
  margin-bottom: 2rem;
`;

/* ── Buttons ─────────────────────────────────────────────── */

const ButtonArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
`;

const OutlineButton = styled.button`
  width: 100%;
  padding: 1.0625rem;
  background: transparent;
  border: 1.5px solid ${C.brown};
  border-radius: 9999px;
  font-family: 'Noto Serif KR', serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${C.brown};
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: rgba(44, 26, 16, 0.06);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TextButton = styled.button`
  background: none;
  border: none;
  font-family: 'Noto Serif KR', serif;
  font-size: 1rem;
  color: ${C.muted};
  cursor: pointer;
  padding: 0.5rem;
  letter-spacing: 0.02em;

  &:hover {
    color: ${C.brown};
  }
`;

/* ── Envelope (AlreadySentView) ──────────────────────────── */

const EnvelopeWrapper = styled.div`
  width: min(300px, 80vw);
  margin: 0 auto 2rem;
  position: relative;
`;

const EnvelopeBody = styled.div`
  background: ${C.envelopeBody};
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const EnvelopeFlap = styled.div`
  width: 100%;
  height: 0;
  border-left: calc(min(300px, 80vw) / 2) solid transparent;
  border-right: calc(min(300px, 80vw) / 2) solid transparent;
  border-top: 64px solid ${C.envelopeFlap};
`;

const EnvelopeBase = styled.div`
  height: 120px;
`;

const StampArea = styled.div`
  position: absolute;
  top: 10px;
  right: 12px;
  width: 58px;
  height: 68px;
  border: 1.5px dashed rgba(181, 80, 58, 0.6);
  background: rgba(240, 228, 214, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  transform: rotate(6deg);
`;

const StampText = styled.span`
  font-size: 0.4rem;
  letter-spacing: 0.12em;
  color: ${C.rust};
  font-weight: 700;
  text-transform: uppercase;
`;

const StampDateBig = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.rust};
  line-height: 1.1;
  text-align: center;
`;

const PostmarkRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-6deg);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid rgba(181, 80, 58, 0.5);
  pointer-events: none;
`;

/* ── Sub-views ───────────────────────────────────────────── */

function CancellableView({
  token,
  recipientName,
  sendAt,
}: {
  token: string;
  recipientName: string;
  sendAt: string;
}) {
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postmark = getPostmark(sendAt);

  const handleCancel = async () => {
    setIsCancelling(true);
    setError(null);
    try {
      await cancelLetter(token);
      setIsDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '취소 중 오류가 발생했어요.');
      setIsCancelling(false);
    }
  };

  if (isDone) {
    return (
      <Page>
        <TopContent style={{ justifyContent: 'center', alignItems: 'center' }}>
          <BrandLabel>Cancelled</BrandLabel>
          <Title>{'편지가\n취소됐어요'}</Title>
          <Description>
            편지는 즉시 영구히 삭제되었어요.<br />
            언제든 새로운 편지를 써보세요.
          </Description>
        </TopContent>
        <ButtonArea>
          <OutlineButton onClick={() => navigate('/')}>홈으로</OutlineButton>
        </ButtonArea>
      </Page>
    );
  }

  return (
    <Page>
      <TopContent>
        <BrandLabel>Cancel Delivery</BrandLabel>
        <Title>{'이 편지를\n정말 취소할까요?'}</Title>

        <LetterCard>
          <CardLabel>예약된 편지</CardLabel>

          <PostmarkCircle>
            <PostmarkSentBy>Send By</PostmarkSentBy>
            <PostmarkDate>{postmark.day} {postmark.month}</PostmarkDate>
            <PostmarkYear>{postmark.year}</PostmarkYear>
          </PostmarkCircle>

          <InfoRow>
            <InfoLabel>받는 사람</InfoLabel>
            <InfoValue>{recipientName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>도착 예정</InfoLabel>
            <InfoValueRust>{formatKoreanDate(sendAt)}</InfoValueRust>
          </InfoRow>
          <InfoRow>
            <InfoLabel>상태</InfoLabel>
            <InfoValue>발송 대기 중</InfoValue>
          </InfoRow>
        </LetterCard>

        {error && (
          <WarningText style={{ color: '#C0392B' }}>{error}</WarningText>
        )}

        <WarningText>
          취소하면 편지는 즉시 영구히 삭제돼요.<br />
          이 작업은 되돌릴 수 없어요.
        </WarningText>
      </TopContent>

      <ButtonArea>
        <OutlineButton onClick={handleCancel} disabled={isCancelling}>
          {isCancelling ? '취소 중...' : '편지 취소하기'}
        </OutlineButton>
        <TextButton onClick={() => navigate('/')}>그대로 두고 닫기</TextButton>
      </ButtonArea>
    </Page>
  );
}

function AlreadySentView({ status }: { status: 'sent' | 'cancelled' }) {
  const navigate = useNavigate();
  const isCancelled = status === 'cancelled';

  return (
    <Page>
      <TopContent>
        <BrandLabel>Already {isCancelled ? 'Cancelled' : 'Delivered'}</BrandLabel>

        <EnvelopeWrapper>
          <EnvelopeBody>
            <EnvelopeFlap />
            <EnvelopeBase />
            <StampArea>
              <StampText>Sent By</StampText>
              <StampDateBig>Future</StampDateBig>
              <StampText>Letter</StampText>
              <PostmarkRing />
            </StampArea>
          </EnvelopeBody>
        </EnvelopeWrapper>

        <Title style={{ marginBottom: '1rem' }}>
          {isCancelled ? '이미 취소된 편지예요' : '편지는 이미 도착했어요'}
        </Title>
        <Description>
          {isCancelled
            ? '이미 취소 처리된 편지예요.\n더 이상 변경할 수 없어요.'
            : '이미 발송된 편지는 취소할 수 없어요.\n메일함을 열어 오늘의 마음을 만나 보세요.'}
        </Description>
      </TopContent>

      <ButtonArea>
        <OutlineButton onClick={() => navigate('/')}>홈으로</OutlineButton>
      </ButtonArea>
    </Page>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export function CancelPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [pageStatus, setPageStatus] = useState<PageStatus>('loading');
  const [letterDetail, setLetterDetail] = useState<{ recipientName: string; sendAt: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setPageStatus('error');
      setErrorMessage('유효하지 않은 링크예요.');
      return;
    }

    getCancelStatus(token)
      .then((res: CancelStatusResponse) => {
        if (res.status === 'cancellable') {
          setLetterDetail({ recipientName: res.recipientName, sendAt: res.sendAt });
        }
        setPageStatus(res.status);
      })
      .catch((err) => {
        setPageStatus('error');
        setErrorMessage(err instanceof Error ? err.message : '오류가 발생했어요.');
      });
  }, [token]);

  if (pageStatus === 'loading') {
    return (
      <Page style={{ alignItems: 'center', justifyContent: 'center' }}>
        <BrandLabel>Loading</BrandLabel>
        <Title style={{ fontSize: '1.5rem' }}>확인 중이에요...</Title>
      </Page>
    );
  }

  if (pageStatus === 'error') {
    return (
      <Page>
        <TopContent style={{ justifyContent: 'center', alignItems: 'center' }}>
          <BrandLabel>Error</BrandLabel>
          <Title style={{ fontSize: '1.5rem' }}>{'링크를\n확인해주세요'}</Title>
          <Description>{errorMessage}</Description>
        </TopContent>
        <ButtonArea>
          <OutlineButton onClick={() => navigate('/')}>홈으로</OutlineButton>
        </ButtonArea>
      </Page>
    );
  }

  if (pageStatus === 'cancellable' && token && letterDetail) {
    return (
      <CancellableView
        token={token}
        recipientName={letterDetail.recipientName}
        sendAt={letterDetail.sendAt}
      />
    );
  }

  return <AlreadySentView status={pageStatus as 'sent' | 'cancelled'} />;
}
