# portfolio-desktop

macOS 바탕화면을 그대로 옮겨 놓은 포트폴리오 사이트입니다.
바탕화면의 파일과 폴더를 열면 정리 페이지, GitHub 저장소 목록, 직접 배포한 프로젝트가 **창 안에서** 실행됩니다.

- **배포:** Vercel (`main` 브랜치 push 시 자동 배포)
- **바로가기:** 주소 뒤에 `#fastlane`, `#github`, `#lab`, `#talk-recap` 처럼 붙이면 그 창이 열린 채로 시작합니다
- **언어:** 메뉴 막대 오른쪽에서 한국어 / 日本語 전환, `?lang=ja` 로 일본어로 시작

<br>

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 창 관리 | 열기·닫기·최소화·확대, 제목 막대로 이동, 모서리로 크기 조절, 클릭한 창이 맨 앞으로 |
| 바탕화면 선택 | 빈 곳을 끌어서 여러 아이콘 선택, ⌘/Ctrl/Shift 클릭으로 추가·해제 |
| 단축키 | `Esc`, `⌥W`, `Ctrl+W` 로 맨 앞 창 닫기 (같은 출처 iframe 안에 포커스가 있어도 동작) |
| GitHub 창 | 공개 API로 프로필과 최근 저장소 16개를 불러와 언어별 필터·검색. 실패하면 저장본으로 대체 |
| 실험실 폴더 | 따로 배포한 사이드 프로젝트를 창 안 iframe으로 실행, 새 탭 열기 버튼 제공 |
| 다국어 | 한국어 / 일본어 사전, 사용자 선택을 localStorage에 기억, 정리 페이지까지 같은 언어로 |
| 딥 링크 | 맨 앞 창이 바뀌면 주소의 `#해시`도 바뀌어, 지금 보는 화면을 그대로 공유 가능 |
| 반응형 | 휴대폰에서는 창이 화면 폭에 맞춰 열리고, 아이콘은 탭 한 번으로 열림 |

<br>

## 기술 스택

- **React 18 + TypeScript** (strict, `noUncheckedIndexedAccess`)
- **Vite 5** — 빌드 도구, 정적 파일 배포
- **Zustand** — 창 상태(위치·크기·쌓임 순서)와 언어 상태
- **Feature-Sliced Design** + **Steiger** — 레이어 구조와 그 규칙을 린트로 검사
- **Vitest** — 상태·계산 로직 단위 테스트
- 외부 UI 라이브러리 없이 CSS와 SVG로 직접 그린 macOS 스타일 UI

<br>

## 폴더 구조 (Feature-Sliced Design)

위 레이어는 아래 레이어만 가져다 쓸 수 있고, 같은 레이어의 슬라이스끼리는 서로 모릅니다.
각 슬라이스는 `index.ts`(공개 API)로만 밖에 노출합니다.

```
src/
├─ app/                     # 앱 진입점, 전역 스타일·토큰
├─ pages/
│  └─ desktop/              # 위젯을 조립하고, 항목 종류별로 창 안에 무엇을 그릴지 결정
├─ widgets/
│  ├─ menu-bar/             # 상단 메뉴 막대 (시계, 언어 메뉴)
│  ├─ desktop/              # 바탕화면 아이콘 열 + 드래그 선택 영역
│  ├─ dock/                 # 하단 독 (실행 중 표시 점)
│  ├─ window-layer/         # 열린 창들을 그리는 층
│  ├─ github-browser/       # GitHub 프로필·저장소 목록 창
│  └─ wallpaper/            # canvas로 그린 배경
├─ features/
│  ├─ switch-language/      # 언어 선택 메뉴
│  ├─ marquee-select/       # 드래그로 여러 아이콘 선택
│  ├─ close-window-shortcut/# 키보드로 맨 앞 창 닫기
│  ├─ browse-folder/        # 폴더 창 안에서 항목 열기
│  └─ deep-link/            # #해시 ↔ 맨 앞 창 동기화
├─ entities/
│  ├─ window/               # 창 상태 스토어, 배치 계산, 창 틀(WindowFrame)
│  ├─ desktop-item/         # 바탕화면 항목 데이터·타입, 아이콘, 프로젝트 iframe
│  ├─ github/               # GitHub API, 저장본, 저장소 정렬·집계
│  └─ profile/              # README 카드
└─ shared/
   ├─ i18n/                 # 사전, 번역 함수, 언어 스토어
   ├─ lib/                  # localStorage 래퍼, 뷰포트, 환경 판별, useNow
   └─ ui/                   # SVG 아이콘
```

<br>

## 설계하면서 고민한 것

### 1. 위젯끼리 의존하지 않게 창 내용 결정을 페이지로 올림
창을 그리는 `window-layer` 위젯이 GitHub 창, 폴더 창 같은 다른 위젯을 직접 import하면 FSD의 "같은 레이어끼리 참조 금지" 규칙을 어기게 됩니다.
그래서 `WindowLayer`는 `renderContent(item)` 함수를 props로 받기만 하고, 항목 종류(`readme | github | page | folder | project`)별로 무엇을 그릴지는 `pages/desktop`이 정합니다.
`DesktopItem`을 판별 유니언 타입으로 만들어서, 새 종류를 추가하면 `switch`에서 빠진 경우를 타입 검사가 잡아 줍니다.

### 2. 창 상태를 한 곳(Zustand)에서 관리
창마다 `rect`(위치·크기), `z`(쌓임 순서), `minimized`, `maximized`, `prevRect`(확대 전 위치)를 갖습니다.
"맨 앞 창"은 따로 저장하지 않고 `selectTopWindowId`로 매번 계산해서, 최소화·닫기·포커스가 바뀌어도 값이 어긋나지 않습니다.
같은 선택자를 창 제목 색, 단축키로 닫을 창, 주소 해시 동기화가 함께 씁니다.

### 3. 항목 추가는 데이터 한 줄
`entities/desktop-item/model/items.ts`에 객체 하나를 넣으면 바탕화면 아이콘, 독, 창, `#해시` 바로가기가 함께 생깁니다.
`parent: "lab"`을 주면 바탕화면 대신 실험실 폴더 안에 들어갑니다.

<br>

## 트러블슈팅

| 문제 | 원인 | 해결 |
| --- | --- | --- |
| GitHub 페이지를 창 안에 띄울 수 없음 | GitHub이 `X-Frame-Options`로 다른 사이트 안에 표시되는 것을 막음 | iframe 대신 공개 API로 데이터를 받아 직접 UI를 그림. 6초 안에 못 받거나 실패하면 빌드에 넣어 둔 저장본으로 대체 |
| 미리보기 환경에서 외부 프로젝트 창이 빈 화면 | 호스트의 CSP `frame-src`가 외부 사이트를 차단 | 호스트를 판별해, 막힌 환경에서는 빈 iframe 대신 "새 탭에서 열기" 안내를 표시 |
| `⌘W`로 페이지 안 창을 닫고 싶음 | `⌘W`는 브라우저가 먼저 처리해 페이지에 전달되지 않음 | `⌥W`·`Ctrl+W`·`Esc`로 대체. `⌥W`는 맥에서 `key`가 `∑`로 오므로 `code === "KeyW"`로 판별 |
| 정리 페이지 iframe 안을 클릭하면 단축키가 안 먹음 | 키 이벤트가 iframe 문서에서 끝남 | 같은 출처 iframe은 `onLoad`에서 내부 문서에도 같은 핸들러를 연결 |
| 개발 서버에서 `fastlane.html?lang=ja`가 앱 첫 화면으로 바뀜 | 쿼리가 붙은 `.html` 요청을 Vite가 SPA 폴백으로 처리 | 언어를 쿼리 대신 해시(`#lang=ja`)로 넘기고, 언어가 바뀌면 `key`로 iframe을 다시 불러옴 |
| 드래그 선택이 끝나자마자 선택이 풀림 | `pointerup` 뒤에 오는 `click`이 "빈 곳 클릭 = 선택 해제"로 처리됨 | 드래그가 실제로 일어났으면 다음 `click` 한 번을 무시(`consumeClick`) |
| 같은 SVG 아이콘을 여러 개 그리면 그라데이션이 깨짐 | SVG `id`가 문서 전체에서 겹침 | `useId()`로 아이콘마다 고유한 그라데이션 id 생성 |

<br>

## 테스트와 검사

```bash
npm run test       # Vitest: 창 스토어, 창 배치, i18n, 저장소 정렬, 단축키 판별, 드래그 사각형 (19개)
npm run typecheck  # TypeScript strict
npm run lint:fsd   # Steiger: FSD 레이어·공개 API 규칙
```

Steiger 규칙 중 `insignificant-slice`(한 곳에서만 쓰는 슬라이스는 합치라는 규칙)만 껐습니다.
페이지가 하나뿐이라 모든 위젯이 한 곳에서만 쓰이는데, 사용처 개수보다 책임 단위로 나누는 쪽이 읽기 쉽다고 판단했습니다.

<br>

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ 에 정적 파일 생성
```

<br>

## 이력서에 쓸 수 있는 문장

> **portfolio-desktop** · 개인 프로젝트 · React, TypeScript, Zustand, Vite
> - macOS 데스크톱 컨셉의 포트폴리오 사이트를 설계·개발. 창 열기/이동/크기 조절/최소화/확대, 드래그 다중 선택, 키보드 단축키를 라이브러리 없이 구현
> - Feature-Sliced Design으로 6개 레이어·16개 슬라이스로 나누고, Steiger로 레이어 의존 규칙을 자동 검사. 위젯 간 의존은 페이지에서 렌더 함수를 주입하는 방식으로 제거
> - 창 상태를 Zustand 단일 스토어로 관리하고 "맨 앞 창"을 파생 값으로 계산해, 포커스·단축키·URL 해시 동기화가 같은 기준으로 동작하도록 구성
> - GitHub 페이지 임베드 차단(X-Frame-Options)을 공개 API + 저장본 폴백으로 해결, 외부 사이트를 막는 환경에서는 새 탭 안내로 자동 전환
> - 한국어/일본어 다국어 지원(사전 키 누락을 테스트로 검사), 딥 링크(`#fastlane`)로 특정 창을 연 상태로 공유 가능
> - Vitest로 상태·계산 로직 단위 테스트 19개 작성
