import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { LetterForm } from '@/domains/letters/components/LetterForm';

const C = {
  bg: '#F2EDE4',
  brown: '#2C1A10',
  rust: '#B5503A',
  muted: '#9B8B78',
} as const;

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
  line-height: 1.35;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
`;

export function WritePage() {
  const navigate = useNavigate();

  return (
    <Page>
      <BackButton onClick={() => navigate(-1)}>
        ← 돌아가기
      </BackButton>
      <BrandLabel>Epistle</BrandLabel>
      <Title>
        오늘의 마음을<br />
        천천히 적어 보세요
      </Title>
      <LetterForm />
    </Page>
  );
}
