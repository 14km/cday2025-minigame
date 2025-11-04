# CLAUDE.md - Project Setup & Development Guide

## Project Overview
캐릭터 육성 이벤트 서비스 - 1시간마다 30자 프롬프트로 최강의 캐릭터 만들기

## Tech Stack
- **Frontend**: Vite + React 18 + TypeScript
- **Backend**: Supabase (Auth, Database, Realtime, Edge Functions)
- **Styling**: Ant Design + styled-components
- **Linter/Formatter**: Biome.js
- **State Management**: Zustand
- **Router**: React Router v6
- **Form**: Ant Design Form + Zod

---

## Initial Setup

### 1. Prerequisites
```bash
node --version  # v18+ required
yarn --version  # or npm
```

### 2. Project Initialization

#### Step 1: Create Vite Project
```bash
yarn create vite cday2025-minigame --template react-ts
cd cday2025-minigame
```

#### Step 2: Install Dependencies
```bash
# Core dependencies
yarn add react react-dom react-router-dom @supabase/supabase-js

# State Management & Data Fetching
yarn add zustand @tanstack/react-query

# UI - Ant Design (모든 페이지에서 사용)
yarn add antd @ant-design/icons

# Styling
yarn add styled-components
yarn add -D @types/styled-components

# Form & validation
yarn add zod

# Utils
yarn add dayjs

# Dev dependencies
yarn add -D @biomejs/biome
yarn add -D @types/node
```

#### Step 3: Initialize Configurations
```bash
# Biome.js only
yarn biome init

# ❌ Tailwind 설정 안 함 (사용하지 않음)
```

---

## Configuration Files

### 1. package.json Scripts
Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "format": "biome format --write .",
    "lint": "biome lint --write .",
    "check": "biome check --write .",
    "type-check": "tsc --noEmit",
    "prebuild": "yarn format && yarn lint && yarn type-check"
  }
}
```

### 2. biome.json
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["node_modules", "dist", "build", ".vite", "*.config.js"]
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 100,
    "attributePosition": "auto"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "warn"
      },
      "style": {
        "noNonNullAssertion": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "trailingCommas": "es5",
      "semicolons": "asNeeded",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "bracketSameLine": false,
      "quoteStyle": "single",
      "attributePosition": "auto"
    }
  }
}
```

### 3. tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 5. vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### 6. .env.example
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Project Structure

```
cday2025-minigame/
├── docs/
│   ├── DB_DESIGN.md
│   ├── API_SPEC.md
│   └── FRONT.md
├── supabase/
│   ├── migrations/
│   │   └── 20250101000000_initial_schema.sql
│   ├── functions/
│   │   ├── submit-prompt/
│   │   ├── advance-round/
│   │   └── get-my-rank/
│   └── config.toml
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── character/
│   │   ├── leaderboard/
│   │   └── game/
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Auth/
│   │   ├── Game/
│   │   ├── Leaderboard/
│   │   └── Profile/
│   ├── hooks/
│   ├── store/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── config/
│   │   └── antd.config.ts
│   └── styles/
│       ├── theme.ts
│       ├── globalStyles.ts
│       └── antdTheme.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── biome.json
├── .env
└── .env.example
```

---

## Development Workflow

### Before Every Commit
```bash
# Format code
yarn format

# Lint and fix
yarn lint

# Type check
yarn type-check

# Build to ensure no errors
yarn build
```

### Development Server
```bash
yarn dev
```

### Production Build
```bash
yarn build
yarn preview
```

---

## Supabase Setup

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Initialize Supabase Project
```bash
supabase init
```

### 4. Link to Remote Project
```bash
supabase link --project-ref your-project-ref
```

### 5. Create Migration from DB_DESIGN.md
```bash
supabase migration new initial_schema
```

Copy SQL from `docs/DB_DESIGN.md` to migration file.

### 6. Push Database Changes
```bash
supabase db push
```

### 7. Generate TypeScript Types
```bash
supabase gen types typescript --local > src/types/database.types.ts
```

---

## Core Patterns & Guidelines

**이 섹션은 실제 코드 구현의 가이드라인입니다. 구체적인 코드는 src/ 디렉토리를 참조하세요.**

### 1. Project Structure
```
src/
├── App.tsx                    # QueryClient + Routes
├── store/authStore.ts         # Auth만 (모듈 레벨 초기화)
├── hooks/queries/             # React Query hooks
├── services/                  # Edge Functions API 호출
├── components/                # UI 컴포넌트
├── pages/                     # 페이지
├── config/                    # 설정 (env, antd theme)
├── types/                     # TypeScript 타입
└── utils/                     # 유틸리티
```

### 2. Setup Files (필수 생성 파일)
- `config/env.ts` - 환경변수 검증
- `config/antd.config.ts` - Ant Design 테마
- `services/supabase.ts` - Supabase 클라이언트 설정
- `store/authStore.ts` - 인증 상태 (모듈 레벨 초기화)
- `styles/theme.ts`, `styles/globalStyles.ts` - 스타일
- `styled.d.ts` - styled-components 타입

### 3. App.tsx Structure
**필수 Providers 순서:**
1. ErrorBoundary (최상위)
2. QueryClientProvider (React Query)
3. ThemeProvider (styled-components)
4. ConfigProvider (Ant Design)
5. BrowserRouter (React Router)

**AuthGuard로 Protected Routes 구분**

### 4. Environment Variables
`.env` 파일 필수 변수:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_ACCESS_TOKEN` (CLI 배포용)

---

## Git Hooks (Optional)

### Install husky
```bash
yarn add -D husky lint-staged
npx husky init
```

### .husky/pre-commit
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn format
yarn lint
yarn type-check
```

### package.json
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "biome format --write",
      "biome lint --write"
    ]
  }
}
```

---

## Development Guidelines

### 1. Code Style
- Use Biome.js for formatting and linting
- Follow TypeScript strict mode
- Use functional components with hooks
- **Named exports** for components (현재 프로젝트 표준)
- `type FC` for component types (not `React.FC`)

### 2. Component Guidelines

**원칙:**
- Ant Design 컴포넌트 우선 사용 (Card, Space, Typography, Button 등)
- `style` prop으로 간단한 스타일 적용
- styled-components는 복잡한 스타일링에만 사용
- Named export 사용: `export const ComponentName: FC = () => {}`
- Props 타입은 interface로 정의
- `type FC` 사용 (not `React.FC`)

**참고:** 실제 예제는 `src/pages/` 또는 `src/components/` 참조

### 3. Data Fetching (React Query)

**모든 API 호출은 React Query 사용:**

**Query Hook 패턴 (데이터 조회):**
- `queryKey`: 캐시 키 (배열)
- `queryFn`: API 호출 함수
- `enabled`: 조건부 실행
- 위치: `src/hooks/queries/`

**Mutation Hook 패턴 (데이터 변경):**
- `mutationFn`: API 호출 함수
- `onSuccess`: 성공 시 캐시 무효화
- `queryClient.invalidateQueries()`: 자동 리프레시

**참고:** `src/hooks/queries/useCharacterQuery.ts` 참조

**장점:**
- 자동 캐싱, 중복 요청 방지
- 로딩/에러 자동 관리
- useState, useEffect 불필요

### 4. Service Layer (Edge Functions Only)

**원칙:**
- 모든 API는 `supabase.functions.invoke()` 사용
- Direct DB access (`supabase.from()`) **절대 금지**
- Edge Functions에서 모든 비즈니스 로직 처리
- 에러 처리: `if (error) throw error; if (!data.success) throw new Error()`
- 위치: `src/services/*.service.ts`

**참고:** `src/services/character.service.ts` 참조

---

## Deployment

### Prerequisites
1. Supabase 프로젝트 생성 완료
2. Database migrations 완료
3. Edge Functions 배포 완료
4. 초기 super_admin 계정 생성 완료

### Step 1: Build for Production
```bash
yarn format
yarn lint
yarn type-check
yarn build
```

### Step 2: Deploy Edge Functions to Supabase
```bash
# .env에 SUPABASE_ACCESS_TOKEN 설정 필요
# Supabase Dashboard > Settings > API > Service role key

# 모든 Edge Functions 배포
supabase functions deploy submit-prompt
supabase functions deploy get-current-round
supabase functions deploy get-my-prompts
supabase functions deploy get-my-character
supabase functions deploy create-character
supabase functions deploy update-character-name
supabase functions deploy get-round-info
supabase functions deploy get-leaderboard
supabase functions deploy get-past-leaderboard
supabase functions deploy get-my-rank
supabase functions deploy update-profile

# Admin Functions (11개)
supabase functions deploy admin-rounds-create
supabase functions deploy admin-rounds-start
supabase functions deploy admin-rounds-end
supabase functions deploy admin-rounds-extend
supabase functions deploy admin-rounds-cancel
supabase functions deploy admin-rounds-list
supabase functions deploy admin-prompts-list
supabase functions deploy admin-prompts-delete
supabase functions deploy admin-users-list
supabase functions deploy admin-users-detail
supabase functions deploy admin-users-ban
supabase functions deploy admin-users-unban
supabase functions deploy admin-stats
supabase functions deploy admin-stats-rounds
supabase functions deploy admin-stats-users
supabase functions deploy admin-audit-log

# 또는 배포 스크립트 사용 (생성 필요)
# ./deploy-edge-functions.sh
```

### Step 3: Deploy Frontend to Vercel

#### Option A: Vercel CLI (추천)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 환경 변수 설정
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Production 배포
vercel --prod
```

#### Option B: Vercel Dashboard
1. https://vercel.com 에서 프로젝트 import
2. GitHub repository 연결
3. Build settings:
   - Framework Preset: Vite
   - Build Command: `yarn build`
   - Output Directory: `dist`
4. Environment Variables 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy 클릭

### Step 4: Deploy Frontend to Netlify (Alternative)

```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 배포
netlify deploy

# Production 배포
netlify deploy --prod
```

Or via Netlify Dashboard:
1. https://netlify.com 에서 프로젝트 import
2. Build settings:
   - Build command: `yarn build`
   - Publish directory: `dist`
3. Environment variables 추가
4. Deploy

### Step 5: Post-Deployment Setup

#### 1. Create Super Admin Account
Supabase SQL Editor에서 실행:
```sql
-- 본인 이메일로 super_admin 권한 부여
UPDATE profiles
SET role = 'super_admin'
WHERE email = 'your-email@example.com';
```

#### 2. Verify Deployment
- [ ] 프론트엔드 접속 확인
- [ ] Google OAuth 로그인 테스트
- [ ] 캐릭터 생성/프롬프트 제출 테스트
- [ ] 리더보드 실시간 업데이트 확인
- [ ] Admin 페이지 접근 확인 (/admin)
- [ ] Admin 기능 테스트 (라운드 생성/시작/종료)

#### 3. Monitor Edge Functions
```bash
# Edge Function 로그 확인
supabase functions logs submit-prompt
supabase functions logs admin-rounds-start
```

### Production URLs
- **Frontend**: https://your-app.vercel.app
- **Supabase**: https://your-project.supabase.co
- **Admin Panel**: https://your-app.vercel.app/admin

---

## Troubleshooting

### Issue: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
```

### Issue: Biome errors
```bash
# Fix all auto-fixable issues
yarn check

# Or manually fix
yarn format
yarn lint
```

### Issue: Type errors
```bash
# Regenerate Supabase types
supabase gen types typescript --local > src/types/database.types.ts
```

---

## Next Steps

1. ✅ Complete initial setup
2. ⬜ Set up Supabase project and database
3. ⬜ Implement authentication flow
4. ⬜ Create base components (Button, Input, Card, etc.)
5. ⬜ Build layout components (Header, Footer, Navigation)
6. ⬜ Implement routing structure
7. ⬜ Create state management stores
8. ⬜ Build core pages (Dashboard, Leaderboard, etc.)
9. ⬜ Implement real-time features
10. ⬜ Add animations and polish
11. ⬜ Testing and optimization
12. ⬜ Deploy to production

---

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Biome.js Documentation](https://biomejs.dev/)
- [Radix UI Documentation](https://www.radix-ui.com/)
