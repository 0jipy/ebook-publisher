# CLAUDE.md — ebook-publisher

## 프로젝트 개요

한국 전자책 출판 워크플로우 대시보드. 기획부터 마케팅까지 6단계 체크리스트와 교보문고·리디북스·예스24·알라딘 플랫폼 등록 가이드를 제공하며, Claude AI 분석 기능을 내장한다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **UI**: React 19, 인라인 스타일 + Tailwind CSS v4 (레이아웃 전용)
- **폰트**: Geist / Geist Mono (Google Fonts)
- **린터**: ESLint 9 (flat config, next/core-web-vitals)
- **패키지 매니저**: npm

## 개발 명령어

```bash
npm run dev      # 개발 서버 (Turbopack, http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```

## 디렉터리 구조

```
app/
  layout.js            # 루트 레이아웃 (폰트, 메타데이터)
  page.js              # 홈 페이지 (EbookPublisher 렌더)
  ebook-publisher.jsx  # 메인 대시보드 컴포넌트 (핵심 로직 전체)
  globals.css          # Tailwind import + CSS 변수
public/                # 정적 파일 (SVG 아이콘 등)
```

## 핵심 컴포넌트: `ebook-publisher.jsx`

- `'use client'` 클라이언트 컴포넌트
- 상태: `activeStage`, `checkedTasks`, `platformChecks`, `aiInput`, `aiResponse`, `aiLoading`, `bookInfo`
- 6단계 워크플로우: `plan → draft → edit → register → marketing → manage`
- 플랫폼별 강조색: 교보문고 `#E8321A` / 리디북스 `#1A6EE8` / 예스24 `#E87B1A` / 알라딘 `#1AAA6E`

## 디자인 시스템 (다크 테마)

| 토큰 | 값 |
|---|---|
| 배경 | `#0A0A0F` |
| 카드 배경 | `#12121A` |
| 입력 배경 | `#1A1A28` |
| 테두리 | `#252535` |
| 기본 텍스트 | `#E8E8F2` |
| 보조 텍스트 | `#6B6B8A` |
| 중간 텍스트 | `#B0B0D0` |
| 활성 탭 배경 | `linear-gradient(135deg, #0D1B3E, #0D2456)` |
| 버튼/강조 | `linear-gradient(135deg, #1A5EE8, #4A8AFF)` |

> **규칙**: 색상은 반드시 인라인 스타일로, 레이아웃(flex·grid·gap·padding 등)은 Tailwind 클래스로 처리한다.

## API 연동

`/api/analyze` 엔드포인트가 필요하다 (미구현).

```
POST /api/analyze
Body: { prompt: string, bookInfo: { title, author, genre, price } }
Response: { result: string }
```

Claude AI API를 호출하는 Next.js Route Handler로 구현 예정.

## 경로 별칭

`jsconfig.json`에서 `@/*` → 프로젝트 루트로 설정.

```js
import Something from '@/app/something';
```

## 코딩 컨벤션

- 파일: `.jsx` (React 컴포넌트), `.js` (설정 및 페이지)
- 타입스크립트 미사용
- 상수(STAGES, PLATFORMS 등)는 컴포넌트 밖 모듈 최상단에 선언
- 새 플랫폼 추가 시 `PLATFORMS` 배열에 `{ id, name, accent, items }` 객체 추가
