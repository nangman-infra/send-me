import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useLetterHistory } from '@/domains/letters/hooks/useLetterHistory';
import type { StoredLetter } from '@/domains/letters/hooks/useLetterHistory';

const MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;

const C = {
  bg: '#F2EDE4',
  brown: '#2C1A10',
  rust: '#B5503A',
  muted: '#9B8B78',
  cardBg: '#FDFAF6',
  inputBorder: '#C0B4A0',
} as const;

function formatKoreanDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function getPostmark(dateStr: string): { day: string; month: string } {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: MONTHS_EN[date.getMonth()],
  };
}

/* ── Layout ─────────────────────────────────────────────── */

const Page = styled.main`
  min-height: 100dvh;
  background: ${C.bg};
  padding: 1.25rem 1.5rem 3rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: ${C.muted};
  font-size: 0.875rem;
  font-family: 'Noto Serif KR', serif;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.75rem;

  &:hover {
    color: ${C.brown};
  }
`;

const BrandLabel = styled.p`
  font-size: 0.6875rem;
  letter-spacing: 0.3em;
  color: ${C.rust};
  text-transform: uppercase;
  margin-bottom: 0.625rem;
`;

const Title = styled.h1`
  font-family: 'Gaegu', cursive;
  font-size: clamp(1.875rem, 7vw, 2.25rem);
  font-weight: 700;
  color: ${C.brown};
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
`;

/* ── Letter Card ─────────────────────────────────────────── */

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const Card = styled.div`
  background: ${C.cardBg};
  border-radius: 14px;
  padding: 1.125rem 1.25rem;
  position: relative;
  box-shadow: 0 2px 12px rgba(100, 70, 40, 0.08);
  overflow: hidden;
`;

const PostmarkStamp = styled.div`
  position: absolute;
  top: -6px;
  right: 14px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 2px dashed rgba(181, 80, 58, 0.45);
  background: rgba(240, 228, 214, 0.88);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  transform: rotate(10deg);
`;

const StampSentBy = styled.span`
  font-size: 0.38rem;
  letter-spacing: 0.12em;
  color: ${C.rust};
  font-weight: 700;
  text-transform: uppercase;
`;

const StampDate = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${C.rust};
  line-height: 1.1;
  text-align: center;
`;

const RecipientName = styled.p`
  font-family: 'Gaegu', cursive;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${C.brown};
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  padding-right: 64px;
`;

const SendAt = styled.p`
  font-family: 'Gaegu', cursive;
  font-size: 0.9375rem;
  color: ${C.rust};
  margin-bottom: 0.75rem;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #EDE6DC;
  padding-top: 0.625rem;
  margin-top: 0.625rem;
`;

const CreatedAt = styled.span`
  font-size: 0.75rem;
  color: ${C.muted};
`;

const CancelLink = styled.button`
  background: none;
  border: none;
  font-family: 'Noto Serif KR', serif;
  font-size: 0.75rem;
  color: ${C.muted};
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${C.rust};
  }
`;

/* ── Empty State ─────────────────────────────────────────── */

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 0;
  gap: 0.75rem;
`;

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.p`
  font-family: 'Gaegu', cursive;
  font-size: 1.25rem;
  color: ${C.brown};
  letter-spacing: 0.05em;
`;

const EmptyDesc = styled.p`
  font-size: 0.875rem;
  color: ${C.muted};
  text-align: center;
  line-height: 1.75;
  margin-bottom: 1rem;
`;

const WriteButton = styled.button`
  padding: 0.75rem 2rem;
  background: ${C.rust};
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-family: 'Noto Serif KR', serif;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: background 0.15s ease;

  &:hover {
    background: #9E4430;
  }
`;

/* ── Sub-components ──────────────────────────────────────── */

function LetterCard({ letter }: { letter: StoredLetter }) {
  const navigate = useNavigate();
  const postmark = getPostmark(letter.sendAt);

  const createdDate = new Date(letter.createdAt);
  const createdLabel = `${createdDate.getFullYear()}.${String(createdDate.getMonth() + 1).padStart(2, '0')}.${String(createdDate.getDate()).padStart(2, '0')} 작성`;

  return (
    <Card>
      <PostmarkStamp>
        <StampSentBy>Send By</StampSentBy>
        <StampDate>{postmark.day} {postmark.month}</StampDate>
      </PostmarkStamp>

      <RecipientName>{letter.recipientName}</RecipientName>
      <SendAt>{formatKoreanDate(letter.sendAt)} 도착 예정</SendAt>

      <CardFooter>
        <CreatedAt>{createdLabel}</CreatedAt>
        <CancelLink onClick={() => navigate(`/cancel/${letter.cancelToken}`)}>
          취소하기
        </CancelLink>
      </CardFooter>
    </Card>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export function HistoryPage() {
  const navigate = useNavigate();
  const { letters } = useLetterHistory();

  return (
    <Page>
      <BackButton onClick={() => navigate(-1)}>← 돌아가기</BackButton>
      <BrandLabel>My Letters</BrandLabel>
      <Title>내 편지 목록</Title>

      {letters.length === 0 ? (
        <EmptyWrapper>
          <EmptyIcon>✉️</EmptyIcon>
          <EmptyTitle>아직 편지가 없어요</EmptyTitle>
          <EmptyDesc>
            첫 편지를 써볼까요?<br />
            미래의 나에게 오늘의 마음을 전해 보세요.
          </EmptyDesc>
          <WriteButton onClick={() => navigate('/write')}>
            편지 쓰기 →
          </WriteButton>
        </EmptyWrapper>
      ) : (
        <CardList>
          {letters.map((letter) => (
            <LetterCard key={letter.id} letter={letter} />
          ))}
        </CardList>
      )}
    </Page>
  );
}
