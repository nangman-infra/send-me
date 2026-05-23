import styled from '@emotion/styled';
import type { Theme } from '@/styles/theme';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const StyledButton = styled.button<{ variant: ButtonVariant; theme?: Theme }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-family: ${({ theme }) => theme?.fonts.body};
  font-size: ${({ theme }) => theme?.fontSizes.md};
  font-weight: 500;
  border-radius: ${({ theme }) => theme?.radii.md};
  border: 2px solid ${({ theme }) => theme?.colors.primary};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;

  background: ${({ variant, theme }) =>
    variant === 'ghost' ? 'transparent' : theme?.colors.primary};
  color: ${({ variant, theme }) =>
    variant === 'ghost' ? theme?.colors.primary : '#ffffff'};

  &:hover:not(:disabled) {
    background: ${({ variant, theme }) =>
      variant === 'ghost' ? theme?.colors.secondary : theme?.colors.primaryHover};
    border-color: ${({ variant, theme }) =>
      variant === 'ghost' ? theme?.colors.primary : theme?.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function Button({ variant = 'primary', isLoading = false, children, disabled, ...rest }: ButtonProps) {
  const isDisabled = disabled || isLoading;
  return (
    <StyledButton variant={variant} disabled={isDisabled} {...rest}>
      {isLoading ? '처리 중...' : children}
    </StyledButton>
  );
}
