import styled from '@emotion/styled';

interface ErrorDialogProps {
  message: string;
  onClose: () => void;
  onRetry?: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(44, 26, 16, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1000;
`;

const Card = styled.div`
  background: #FBF7F2;
  border-radius: 16px;
  padding: 2rem 1.5rem 1.5rem;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 20px 48px rgba(44, 26, 16, 0.2);
`;

const IconCircle = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #FDE8E4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`;

const Title = styled.h2`
  font-family: 'Gaegu', cursive;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C1A10;
  text-align: center;
`;

const Message = styled.p`
  font-size: 0.875rem;
  color: #9B8B78;
  text-align: center;
  line-height: 1.7;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.5rem;
`;

const CloseButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 1.5px solid #C0B4A0;
  border-radius: 9999px;
  background: transparent;
  font-family: 'Noto Serif KR', serif;
  font-size: 0.9375rem;
  color: #9B8B78;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #F0E8DC;
  }
`;

const RetryButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 9999px;
  background: #B5503A;
  font-family: 'Noto Serif KR', serif;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #9E4430;
  }
`;

export function ErrorDialog({ message, onClose, onRetry }: ErrorDialogProps) {
  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <IconCircle>✉️</IconCircle>
        <Title>전송에 실패했어요</Title>
        <Message>{message}</Message>
        <ButtonRow>
          <CloseButton onClick={onClose}>닫기</CloseButton>
          {onRetry && <RetryButton onClick={onRetry}>다시 시도</RetryButton>}
        </ButtonRow>
      </Card>
    </Overlay>
  );
}
