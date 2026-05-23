import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const C = {
  bg: '#F2EDE4',
  brown: '#2C1A10',
  rust: '#B5503A',
  rustHover: '#9E4430',
  muted: '#9B8B78',
  envelopeBody: '#CEC0A0',
  envelopeFlap: '#BDB090',
  envelopeShadow: 'rgba(100, 70, 40, 0.22)',
  waxSeal: '#8B3A2A',
  waxGlow: '#A0453A',
  stampBg: '#EDD8C8',
  stampBorder: '#C4A090',
  dotInactive: '#C8B498',
  cardBg: '#FDFAF6',
} as const;

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
  margin-bottom: 1.75rem;
`;

const TitleGroup = styled.div`
  text-align: center;
  margin-bottom: 1.25rem;
`;

const TitleRow = styled.h1`
  font-family: 'Gaegu', cursive;
  font-size: clamp(2.25rem, 8vw, 2.75rem);
  font-weight: 700;
  color: ${C.brown};
  line-height: 1.35;
  letter-spacing: 0.08em;
  margin: 0;
`;

const TitleRust = styled.span`
  color: ${C.rust};
`;

const SubText = styled.p`
  font-size: 0.9375rem;
  color: ${C.muted};
  line-height: 1.9;
  text-align: center;
  margin-bottom: 1.75rem;
`;

const DotsRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 2rem;
`;

const Dot = styled.span<{ $active?: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? C.rust : C.dotInactive)};
`;

/* ── Envelope ──────────────────────────────────────────── */

const EnvelopeOuter = styled.div`
  position: relative;
  width: min(300px, 88vw);
  margin: 0 auto 4.5rem;
`;

const EnvelopeBody = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  background: ${C.envelopeBody};
  border-radius: 10px;
  box-shadow: 0 14px 44px ${C.envelopeShadow};
  overflow: hidden;
`;

const Flap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: ${C.envelopeFlap};
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  z-index: 1;
`;

const Stamp = styled.div`
  position: absolute;
  top: 10%;
  right: 6%;
  z-index: 2;
  width: 17%;
  aspect-ratio: 0.78;
  background: ${C.stampBg};
  border: 1.5px dashed ${C.stampBorder};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8% 6% 6%;
`;

const StampStripe = styled.div`
  width: 100%;
  height: 18%;
  background: ${C.stampBorder};
  border-radius: 1px;
`;

const StampText = styled.span`
  font-size: 0.42rem;
  letter-spacing: 0.18em;
  color: #8B5A4A;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1;
`;

const EnvelopeContent = styled.div`
  position: absolute;
  bottom: 12%;
  left: 8%;
  z-index: 2;
`;

const ToLabel = styled.p`
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: #9B8060;
  margin-bottom: 3%;
`;

const RecipientText = styled.p`
  font-family: 'Gaegu', cursive;
  font-size: clamp(0.9rem, 3.5vw, 1.1rem);
  color: ${C.brown};
  letter-spacing: 0.12em;
`;

const WaxSeal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 19%;
  aspect-ratio: 1;
  background: radial-gradient(circle at 38% 36%, ${C.waxGlow}, ${C.waxSeal});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
  border: 2px solid #6E2418;
  z-index: 3;
`;

const SealGlyph = styled.span`
  font-family: 'Georgia', serif;
  font-style: italic;
  font-weight: 700;
  font-size: clamp(0.875rem, 3.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.92);
  line-height: 1;
  margin-top: -5%;
`;

/* ── Steps ─────────────────────────────────────────────── */

const StepsRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 340px;
  margin-bottom: 2.5rem;
`;

const Step = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
`;

const StepNum = styled.span`
  font-family: 'Gaegu', cursive;
  font-style: italic;
  font-size: 1.125rem;
  color: ${C.rust};
  line-height: 1;
`;

const StepName = styled.strong`
  font-size: 1rem;
  color: ${C.brown};
  font-weight: 700;
`;

const StepNote = styled.p`
  font-size: 0.75rem;
  color: ${C.muted};
  line-height: 1.55;
  margin: 0;
`;

const StepArrow = styled.span`
  flex-shrink: 0;
  font-size: 0.875rem;
  color: ${C.muted};
  margin-top: 1.75rem;
  padding: 0 0.25rem;
`;

/* ── CTA ───────────────────────────────────────────────── */

const CTAButton = styled.button`
  width: 100%;
  max-width: 320px;
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
  margin-bottom: 1.25rem;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: ${C.rustHover};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const HistoryLink = styled.button`
  background: none;
  border: none;
  font-family: 'Noto Serif KR', serif;
  font-size: 0.9375rem;
  color: ${C.muted};
  cursor: pointer;
  padding: 0.25rem;
  margin-bottom: 1.25rem;
  letter-spacing: 0.02em;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${C.brown};
  }
`;

const Footnote = styled.p`
  font-size: 0.8125rem;
  color: ${C.muted};
  text-align: center;
  line-height: 1.9;
`;

const ContactLink = styled.a`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${C.cardBg};
  border: 1px solid #DDD4C4;
  border-radius: 9999px;
  padding: 0.5rem 0.875rem 0.5rem 0.75rem;
  box-shadow: 0 2px 12px rgba(100, 70, 40, 0.12);
  color: ${C.muted};
  text-decoration: none;
  font-family: 'Noto Serif KR', serif;
  font-size: 0.75rem;
  letter-spacing: 0.01em;
  transition: box-shadow 0.15s ease, color 0.15s ease;
  z-index: 100;

  &:hover {
    color: ${C.brown};
    box-shadow: 0 4px 18px rgba(100, 70, 40, 0.18);
  }

  svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }
`;

export function MainPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <BrandLabel>Post from Yesterday</BrandLabel>

      <TitleGroup>
        <TitleRow>미래의 나에게</TitleRow>
        <TitleRow>
          <TitleRust>편지를</TitleRust> 띠워요
        </TitleRow>
      </TitleGroup>

      <SubText>
        오늘의 나를 봉투에 담아<br />
        내일의 나에게 부쳐 보세요.
      </SubText>

      <DotsRow>
        <Dot />
        <Dot $active />
        <Dot />
      </DotsRow>

      <EnvelopeOuter>
        <EnvelopeBody>
          <Flap />
          <Stamp>
            <StampStripe />
            <StampText>Future</StampText>
          </Stamp>
          <EnvelopeContent>
            <ToLabel>TO</ToLabel>
            <RecipientText>미래의 나에게</RecipientText>
          </EnvelopeContent>
        </EnvelopeBody>
        <WaxSeal>
          <SealGlyph>f</SealGlyph>
        </WaxSeal>
      </EnvelopeOuter>

      <StepsRow>
        <Step>
          <StepNum>01</StepNum>
          <StepName>쓰기</StepName>
          <StepNote>오늘의<br />마음을</StepNote>
        </Step>
        <StepArrow>→</StepArrow>
        <Step>
          <StepNum>02</StepNum>
          <StepName>날짜</StepName>
          <StepNote>받을 날을<br />정해요</StepNote>
        </Step>
        <StepArrow>→</StepArrow>
        <Step>
          <StepNum>03</StepNum>
          <StepName>받기</StepName>
          <StepNote>메일로<br />도착해요</StepNote>
        </Step>
      </StepsRow>

      <CTAButton onClick={() => navigate('/write')}>
        편지 쓰기 →
      </CTAButton>

      <HistoryLink onClick={() => navigate('/history')}>
        내 편지 보기
      </HistoryLink>

      <Footnote>
        가입 없이 한 통.<br />
        전송 후 내용은 영구히 삭제돼요.
      </Footnote>

      <ContactLink href="mailto:sanolx30@gmail.com">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <polyline points="2,4 12,13 22,4" />
        </svg>
        건의사항 · 문의하기
      </ContactLink>
    </Page>
  );
}
