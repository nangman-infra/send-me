import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';

interface DoneState {
  sendAt?: string;
  email?: string;
  recipientName?: string;
}

const WEEKDAYS_FULL = ['일', '월', '화', '수', '목', '금', '토'] as const;
const MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;

function formatDeliveryDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    label: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`,
    sub: `${WEEKDAYS_FULL[date.getDay()]}요일 오전 9시`,
  };
}

function getTodayPostmark() {
  const now = new Date();
  return {
    day: String(now.getDate()).padStart(2, '0'),
    month: MONTHS_EN[now.getMonth()],
    year: now.getFullYear(),
  };
}

const C = {
  bg: '#F2EDE4',
  brown: '#2C1A10',
  rust: '#B5503A',
  muted: '#9B8B78',
  airRed: '#C49080',
  airBlue: '#9EB0BC',
  envelopeBody: '#CEC0A0',
  envelopeFlap: '#BDB090',
  waxSeal: '#8B3A2A',
  waxGlow: '#A0453A',
  cardBg: '#FDFAF6',
  noticeBg: '#FBF5EE',
} as const;

/* ── Layout ─────────────────────────────────────────────── */

const Page = styled.main`
  min-height: 100dvh;
  background: ${C.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem 2.5rem;
`;

const BrandLabel = styled.p`
  font-size: 0.6875rem;
  letter-spacing: 0.3em;
  color: ${C.rust};
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;

const Title = styled.h1`
  font-family: 'Gaegu', cursive;
  font-size: clamp(2rem, 8vw, 2.5rem);
  font-weight: 700;
  color: ${C.brown};
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
  text-align: center;
`;

const SubText = styled.p`
  font-size: 0.9375rem;
  color: ${C.muted};
  text-align: center;
  line-height: 1.9;
  margin-bottom: 2.25rem;
`;

/* ── Airmail Envelope ────────────────────────────────────── */

const AirmailWrapper = styled.div`
  width: min(340px, 92vw);
  margin: 0 auto 2rem;
  border-radius: 10px;
  padding: 7px;
  background: repeating-linear-gradient(
    -45deg,
    ${C.airRed} 0px,
    ${C.airRed} 7px,
    #F2EDE4 7px,
    #F2EDE4 14px,
    ${C.airBlue} 14px,
    ${C.airBlue} 21px,
    #F2EDE4 21px,
    #F2EDE4 28px
  );
  box-shadow: 0 10px 32px rgba(100, 70, 40, 0.18);
`;

const EnvelopeBody = styled.div`
  position: relative;
  background: ${C.envelopeBody};
  border-radius: 5px;
  overflow: hidden;
  padding-bottom: 1.75rem;
`;

const Flap = styled.div`
  width: 100%;
  height: 0;
  border-left: calc(min(340px, 92vw) / 2) solid transparent;
  border-right: calc(min(340px, 92vw) / 2) solid transparent;
  border-top: 72px solid ${C.envelopeFlap};
`;

const PostmarkStamp = styled.div`
  position: absolute;
  top: 8px;
  right: 10px;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  border: 2px solid ${C.rust};
  background: rgba(235, 220, 210, 0.82);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  transform: rotate(-12deg);
  z-index: 2;
`;

const PostmarkSentBy = styled.span`
  font-size: 0.45rem;
  letter-spacing: 0.12em;
  color: ${C.rust};
  font-weight: 700;
  text-transform: uppercase;
`;

const PostmarkDate = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${C.rust};
  line-height: 1;
`;

const PostmarkBrand = styled.span`
  font-size: 0.42rem;
  letter-spacing: 0.14em;
  color: ${C.rust};
  text-transform: uppercase;
`;

const PostmarkYear = styled.span`
  font-size: 0.45rem;
  color: ${C.rust};
  letter-spacing: 0.1em;
`;

const EnvelopeContent = styled.div`
  padding: 0.75rem 1.25rem 0;
  position: relative;
  z-index: 1;
`;

const WaxSeal = styled.div`
  position: absolute;
  top: 44px;
  left: 50%;
  transform: translateX(-50%);
  width: 52px;
  height: 52px;
  background: radial-gradient(circle at 38% 36%, ${C.waxGlow}, ${C.waxSeal});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
  border: 2px solid #6E2418;
  z-index: 3;
`;

const SealGlyph = styled.span`
  font-family: 'Georgia', serif;
  font-style: italic;
  font-weight: 700;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
  margin-top: -3px;
`;

const FromLabel = styled.p`
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: #9B8060;
  text-transform: uppercase;
  margin-bottom: 0.15rem;
`;

const SenderName = styled.p`
  font-family: 'Gaegu', cursive;
  font-size: 0.875rem;
  color: ${C.muted};
  letter-spacing: 0.08em;
`;

const RecipientName = styled.p`
  font-family: 'Gaegu', cursive;
  font-size: 1rem;
  color: ${C.brown};
  letter-spacing: 0.1em;
  font-weight: 700;
`;

/* ── Info Card ───────────────────────────────────────────── */

const InfoCard = styled.div`
  width: min(340px, 92vw);
  background: ${C.cardBg};
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px rgba(100, 70, 40, 0.08);
`;

const DateSection = styled.div`
  padding: 1.25rem 1.5rem 1rem;
  text-align: center;
`;

const DateLabel = styled.p`
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: ${C.muted};
  margin-bottom: 0.5rem;
`;

const DateValue = styled.p`
  font-family: 'Gaegu', cursive;
  font-size: clamp(1.5rem, 6vw, 1.875rem);
  font-weight: 700;
  color: ${C.rust};
  letter-spacing: 0.04em;
  margin-bottom: 0.25rem;
`;

const DateSub = styled.p`
  font-size: 0.875rem;
  color: ${C.muted};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #EDE6DC;
  margin: 0;
`;

const EmailRow = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  color: ${C.muted};

  span:first-of-type {
    color: ${C.brown};
  }
`;

/* ── Notice Card ─────────────────────────────────────────── */

const NoticeCard = styled.div`
  width: min(340px, 92vw);
  background: ${C.noticeBg};
  border-radius: 14px;
  padding: 1.125rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(100, 70, 40, 0.06);
`;

const NoticeIcon = styled.span`
  font-size: 1.125rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
`;

const NoticeText = styled.p`
  font-size: 0.875rem;
  color: ${C.brown};
  line-height: 1.75;
`;

/* ── CTA ───────────────────────────────────────────────── */

const HomeButton = styled.button`
  width: min(340px, 92vw);
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

  &:hover {
    background: #9E4430;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export function DonePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as DoneState;

  const postmark = getTodayPostmark();
  const delivery = state.sendAt ? formatDeliveryDate(state.sendAt) : null;
  const recipientName = state.recipientName ?? '미래의 나에게';
  const email = state.email ?? '';

  return (
    <Page>
      <BrandLabel>Sent</BrandLabel>
      <Title>편지가 떠났어요</Title>
      <SubText>
        이제 잠시 잊고 지내도 괜찮아요.<br />
        제때에 메일함에 도착해 있을 거예요.
      </SubText>

      <AirmailWrapper>
        <EnvelopeBody>
          <Flap />
          <PostmarkStamp>
            <PostmarkSentBy>Sent By</PostmarkSentBy>
            <PostmarkDate>{postmark.day} {postmark.month}</PostmarkDate>
            <PostmarkBrand>Future</PostmarkBrand>
            <PostmarkYear>{postmark.year}</PostmarkYear>
          </PostmarkStamp>
          <WaxSeal>
            <SealGlyph>f</SealGlyph>
          </WaxSeal>
          <EnvelopeContent>
            <FromLabel>From</FromLabel>
            <SenderName>오늘의 나</SenderName>
            <RecipientName>{recipientName}</RecipientName>
          </EnvelopeContent>
        </EnvelopeBody>
      </AirmailWrapper>

      <InfoCard>
        <DateSection>
          <DateLabel>도착  예정일</DateLabel>
          {delivery ? (
            <>
              <DateValue>{delivery.label}</DateValue>
              <DateSub>{delivery.sub}</DateSub>
            </>
          ) : (
            <DateSub>날짜 정보 없음</DateSub>
          )}
        </DateSection>
        {email && (
          <>
            <Divider />
            <EmailRow>
              <span>→</span>
              <span>{email}</span>
            </EmailRow>
          </>
        )}
      </InfoCard>

      <NoticeCard>
        <NoticeIcon>✉️</NoticeIcon>
        <NoticeText>
          확인 이메일을 보냈어요. 이메일의 링크로 보내기 전에 편지를 취소할 수 있어요.
        </NoticeText>
      </NoticeCard>

      <HomeButton onClick={() => navigate('/')}>
        홈으로 돌아가기
      </HomeButton>
    </Page>
  );
}
