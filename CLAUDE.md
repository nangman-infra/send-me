# 미래에 보내는 편지 — CLAUDE.md

---

## ⚙️ AI 행동 원칙 (Default Rules)

너는 단순히 지시를 수행하는 모델이 아니라,
나와 함께 문제를 재구성하고 관점을 확장하는 협업 파트너다.

1. 내가 던진 질문을 그대로 실행하지 말고, 그 질문이 전제하고 있는 가정·누락·편향을 먼저 식별하라.
2. 정답을 바로 제시하기보다, 문제를 더 잘 정의하기 위한 대안적 프레이밍을 함께 제안하라.
3. 인간이 강한 영역(의도, 맥락, 가치 판단)과 AI가 강한 영역(패턴, 확장, 시뮬레이션)을 명확히 분리해 설명하라.
4. 내가 보지 못했을 가능성이 높은 정보 간극, 반대 시나리오, 구조적 한계를 우선적으로 지적하라.
5. 단일 최적 답변보다, 의사결정에 도움이 되는 복수 관점·경로·리스크를 제시하라.
6. 너의 목표는 '좋은 답변'이 아니라 Human-AI 팀 전체의 사고 밀도를 높이는 것이다.
7. 사용자의 동의 없이는 기능 테스트 명목이라도 임의로 삭제·변경·수정을 해서는 안 된다.

---

## 🤖 행동 규칙 (Behavior Rules)

- 항상 한국어로 응답한다.
- NEVER GUESS. 모르면 "모르겠습니다"라고 말하고 hallucination하지 않는다.
- 항상 step-by-step으로 생각하고, 실제 코드 작성 전에 pseudocode로 계획을 먼저 설명한다.
- 버그·문제 식별 시 tree of thought를 사용해 근본 원인을 추적한다.
- 요청된 기능은 완전히 구현한다. TODO, placeholder, 미완성 로직을 절대 남기지 않는다.
- 모든 필요한 import를 포함한다.
- 파일·컴포넌트·변수명은 일관되고 서술적으로 명명한다.
- 코드 작성 전 반드시 코드베이스를 먼저 검색한다.
- 미완성 구현이 감지되면 즉시 경고한다: ⚠️ 이전 작업이 아직 끝나지 않았어요. 계속할까요?
- 수정 요청 시, 요청된 부분만 수정하고 나머지는 절대 건드리지 않는다.

### 절대 경로 규칙

코드에서 경로를 작성할 때 반드시 절대 경로를 사용한다.

```
✅ /home/ubuntu/letter-app/apps/api/src/letters/letters.service.ts
✅ /home/ubuntu/letter-app/apps/web/src/pages/WritePage.tsx
```

### 수정 규칙

사용자가 명시적으로 요청하지 않은 코드·로직·컴포넌트는 절대 수정·추가·삭제·최적화하지 않는다. **엄격히 적용된다.**

### Scratchpad 규칙

사용자가 "plan"이라고 입력하면 현재 작업 내용과 pseudocode를 `scratchpad.md`에 저장한다.

---

## 📁 프로젝트 개요

지금의 나에게 편지를 쓰고, 원하는 날짜에 이메일로 받아보는 서비스.
회원가입 없이 이메일 주소만으로 사용 가능하며, 편지 발송 후 내용은 DB에서 삭제된다.

### 모노레포 구조

```
/
├── apps/
│   ├── web/          # React + Vite + Emotion
│   └── api/          # NestJS
├── pnpm-workspace.yaml
└── CLAUDE.md
```

### 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프론트엔드 | React 18, Vite, Emotion (CSS-in-JS) |
| 백엔드 | NestJS, TypeORM |
| DB | PostgreSQL |
| 이메일 | Nodemailer (Gmail SMTP) |
| 스케줄러 | @nestjs/schedule (Cron) |
| 배포 | EC2 (Ubuntu), PM2, Nginx |
| 패키지 매니저 | pnpm |

---

## 🖥️ 프론트엔드 가이드라인 (apps/web)

### 개발 환경

- Node.js: 사용 가능한 최신 LTS
- React 18 + Vite (최신 LTS)
- Emotion: styled components 방식 (`@emotion/styled`, `@emotion/react`)
- 패키지 매니저: pnpm
- ESLint v9 이상

> UI 라이브러리(MUI, Chakra 등) 사용 금지. Emotion으로만 스타일링한다.

### 개발 원칙

- 백엔드 API는 `VITE_API_URL` 환경변수로만 접근하며 직접 노출하지 않는다.
- 터미널 명령 작성 시 반드시 절대 경로 기반으로 CLI 사용
- `pnpm outdated` 로 의존성 상태 주기적 확인
- 알려진 보안 취약점(CVE)이 있는 버전은 절대 사용하지 않는다
- 프로젝트 시작 전 및 정기적으로 `pnpm audit` 실행

### 디렉터리 구조

```
apps/web/src/
├── domains/
│   └── letters/
│       ├── components/
│       │   └── LetterForm.tsx
│       ├── hooks/
│       │   └── useLetterForm.ts
│       └── api/
│           └── letters.ts
├── pages/
│   ├── MainPage.tsx
│   ├── WritePage.tsx
│   ├── DonePage.tsx
│   └── CancelPage.tsx
├── components/          # 공통 컴포넌트
│   └── Button.tsx
├── styles/
│   └── theme.ts         # Emotion 테마 (색상, 폰트, 간격)
└── App.tsx
```

### 라우팅

| Path | 페이지 | 설명 |
|------|--------|------|
| `/` | MainPage | 서비스 소개 + CTA |
| `/write` | WritePage | 편지 작성 폼 |
| `/done` | DonePage | 작성 완료 안내 |
| `/cancel/:token` | CancelPage | 편지 취소 처리 |

### 폼 필드 및 유효성 검증

| 필드 | 타입 | 필수 | 제약 |
|------|------|------|------|
| 받는 사람 이름 | text | ✅ | 최대 50자 |
| 수신 이메일 | email | ✅ | 이메일 형식 |
| 편지 내용 | textarea | ✅ | 10자 이상, 5,000자 이하 |
| 발송 날짜 | date | ✅ | 오늘 +1일 ~ +10년 |

폼 유효성 검증은 form-level schema 방식을 사용한다 (zod + react-hook-form).

```typescript
// apps/web/src/domains/letters/schemas/letter.schema.ts
import { z } from 'zod';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const tenYearsLater = new Date();
tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);

export const letterSchema = z.object({
  recipientName: z.string().min(1, '이름을 입력해주세요.').max(50, '50자 이내로 입력해주세요.'),
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
  content: z.string().min(10, '10자 이상 입력해주세요.').max(5000, '5,000자 이내로 입력해주세요.'),
  sendAt: z.string().refine((val) => {
    const date = new Date(val);
    return date >= tomorrow && date <= tenYearsLater;
  }, '발송 날짜는 내일부터 10년 이내여야 합니다.'),
});

export type LetterFormValues = z.infer<typeof letterSchema>;
```

### Emotion 스타일 규칙

```typescript
// ✅ styled 컴포넌트 방식 사용
import styled from '@emotion/styled';

const Button = styled.button<{ variant?: 'primary' | 'ghost' }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ variant, theme }) =>
    variant === 'ghost' ? 'transparent' : theme.colors.primary};
`;

// ❌ 인라인 css prop 최소화
// <div css={{ color: 'red' }}> 사용 지양
```

### 컴포넌트 작성 규칙

**Magic Number 금지**
```typescript
// ❌
await delay(300);

// ✅
const ANIMATION_DELAY_MS = 300;
await delay(ANIMATION_DELAY_MS);
```

**복잡한 조건 명명**
```typescript
// ✅
const isSendDateValid = sendAt >= tomorrow && sendAt <= tenYearsLater;
const isFormComplete = recipientName && email && content && sendAt;
return isSendDateValid && isFormComplete;
```

**단일 책임 — 역할별 컴포넌트 분리**
```typescript
// 상태별 분기는 별도 컴포넌트로 분리
function CancelPage() {
  const { status } = useLetterCancelStatus(token);
  return status === 'cancellable' ? <CancellableView /> : <AlreadySentView />;
}
```

**Props Drilling 금지 — Composition 사용**
```typescript
// ❌ 중간 컴포넌트를 통한 props 전달
// ✅ 필요한 컴포넌트에 직접 전달 또는 Context 사용
```

### API 호출 패턴

```typescript
// apps/web/src/domains/letters/api/letters.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function createLetter(data: LetterFormValues) {
  const res = await fetch(`${API_URL}/api/v1/letters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}
```

---

## 🗄️ 백엔드 가이드라인 (apps/api)

### 개발 환경

- Node.js: 사용 가능한 최신 LTS
- NestJS: 최신 LTS (https://docs.nestjs.com/)
- TypeORM, PostgreSQL
- Nodemailer (Gmail SMTP)
- @nestjs/schedule (Cron)
- 패키지 매니저: pnpm

### 개발 원칙

- 알려진 보안 취약점(CVE)이 있는 버전은 절대 사용하지 않는다
- 정기적으로 `pnpm audit` 실행
- Controller는 얇게 유지, 비즈니스 로직은 Service에 위임
- DTO는 `class-validator` + `class-transformer`로 검증

### 디렉터리 구조

```
apps/api/src/
├── modules/
│   ├── letters/
│   │   ├── letters.controller.ts
│   │   ├── letters.service.ts
│   │   ├── letters.repository.ts
│   │   ├── letters.module.ts
│   │   ├── letters.entity.ts
│   │   └── dto/
│   │       └── create-letter.dto.ts
│   ├── mail/
│   │   ├── mail.service.ts
│   │   └── mail.module.ts
│   └── scheduler/
│       ├── scheduler.service.ts
│       └── scheduler.module.ts
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts
│   └── utils/
├── config/
│   └── orm.config.ts
└── main.ts
```

### API 설계 (RESTful + 버전 관리)

| Method | Path | 설명 |
|--------|------|------|
| POST | /api/v1/letters | 편지 작성 |
| GET | /api/v1/letters/cancel/:token | 취소 전 상태 확인 |
| DELETE | /api/v1/letters/cancel/:token | 편지 취소 |

### 통일된 응답 형식

```typescript
// 성공
{ success: true, data: { ... } }

// 실패
{ success: false, error: { statusCode: 400, message: "..." } }
```

### DB 스키마

```sql
CREATE TABLE letters (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name VARCHAR(50)  NOT NULL,
  email          VARCHAR(255) NOT NULL,
  content        TEXT,                        -- 발송 후 NULL로 업데이트
  send_at        DATE         NOT NULL,
  cancel_token   UUID         NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status         VARCHAR(20)  NOT NULL DEFAULT 'pending',
  -- status: 'pending' | 'sent' | 'cancelled'
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  sent_at        TIMESTAMPTZ
);

CREATE INDEX idx_letters_send_at_status ON letters(send_at, status);
CREATE INDEX idx_letters_cancel_token   ON letters(cancel_token);
```

### 비즈니스 규칙

- `send_at` 오늘 기준 최소 +1일, 최대 +10년
- 동일 이메일 하루 최대 5건 (rate limit)
- 편지 발송 완료 후 `content = NULL`, `status = 'sent'`, `sent_at = NOW()`
- 발송 전날 23:59까지 취소 가능 (당일 취소 불가)

### Cron Job

```typescript
// 매일 09:00 KST 실행
@Cron('0 0 9 * * *', { timeZone: 'Asia/Seoul' })
async sendScheduledLetters(): Promise<void> {
  const TODAY = new Date().toISOString().split('T')[0];

  const letters = await this.lettersRepository.findPendingByDate(TODAY);

  for (const letter of letters) {
    try {
      await this.mailService.sendLetter(letter);
      await this.lettersRepository.markAsSent(letter.id);
    } catch (error) {
      // MVP: 콘솔 로그. v2에서 재시도 큐 도입
      console.error(`[Scheduler] 발송 실패 letterId=${letter.id}`, error);
    }
  }
}
```

### 이메일 종류

| 종류 | 트리거 | 내용 |
|------|--------|------|
| 확인 이메일 | 편지 작성 직후 | 발송 예정일 + 취소 링크 |
| 편지 이메일 | Cron Job | 편지 원문 |

### 보안

- `helmet`, `cors`, `@nestjs/throttler` (rate limiting) 필수 적용
- 시크릿은 `.env`에 보관, `@nestjs/config`으로 로드
- DTO는 `class-validator` + `class-transformer`로 검증
- 알려진 CVE 버전 사용 금지

### DIP (의존성 역전 원칙)

```typescript
// 인터페이스에 의존
export interface ILettersRepository {
  findPendingByDate(date: string): Promise<Letter[]>;
  markAsSent(id: string): Promise<void>;
}

@Injectable()
export class SchedulerService {
  constructor(
    @Inject('ILettersRepository')
    private readonly repo: ILettersRepository,
  ) {}
}
```

---

## 🔑 환경변수

### apps/api/.env

```env
NODE_ENV=production
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=future_letters
DB_USER=postgres
DB_PASSWORD=

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASSWORD=         # Gmail App Password
MAIL_FROM="미래에 보내는 편지 <noreply@example.com>"

APP_URL=https://example.com
```

### apps/web/.env

```env
VITE_API_URL=https://api.example.com
```

---

## 🛠️ 개발 명령어

```bash
# 전체 의존성 설치
pnpm install

# 의존성 상태 확인
pnpm outdated

# 보안 취약점 점검
pnpm audit

# 백엔드 개발 서버
pnpm --filter api dev

# 프론트엔드 개발 서버
pnpm --filter web dev

# 빌드
pnpm --filter api build
pnpm --filter web build
```

---

## 🚀 배포 (EC2 + PM2 + Nginx)

```bash
# 백엔드
cd /home/ubuntu/letter-app/apps/api
pnpm build
pm2 start dist/main.js --name "letter-api"

# 프론트엔드 빌드 후 Nginx로 서빙
cd /home/ubuntu/letter-app/apps/web
pnpm build
cp -r dist/* /var/www/html/
```

---

## ✍️ 코딩 컨벤션

| 항목 | 규칙 |
|------|------|
| 언어 | TypeScript strict mode |
| API 응답 | `{ success, data }` or `{ success, error }` 통일 |
| 에러 처리 | NestJS `HttpException` + 전역 ExceptionFilter |
| DTO 검증 | `class-validator` + `class-transformer` |
| Emotion 스타일 | `styled` 컴포넌트 방식, 인라인 `css` prop 최소화 |
| 커밋 메시지 | `feat:` / `fix:` / `chore:` / `refactor:` prefix |
| 절대 경로 | 코드 내 경로는 항상 절대 경로 사용 |
| Magic Number | 반드시 named constant로 추출 |
| 조건 복잡도 | 복잡한 boolean은 named variable로 명명 |
