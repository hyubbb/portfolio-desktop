# portfolio-desktop

맥 바탕화면처럼 꾸민 포트폴리오 사이트입니다. 바탕화면의 파일과 폴더를 열면 각 작업이 창으로 뜹니다.

- `index.html` — 데스크톱 화면. 스크립트 맨 위 `ITEMS` 배열에 한 줄 추가하면 바탕화면·독에 생깁니다
  - `kind: "page"` + `src` — 이 저장소 안의 정리 페이지 (`projects/*.html`)
  - `kind: "project"` + `url` + `parent: "lab"` — 실험실 폴더 안에서 배포된 사이트를 창으로 띄움
- `projects/*.html` — 작업별 정리 페이지 (`?lang=ja`로 일본어)
- 한국어 / 日本語 전환: 메뉴 막대 오른쪽. `?lang=ja` 로 일본어로 시작
- 바로가기: `#fastlane`, `#github`, `#lab`, `#talk-recap` 처럼 해시로 창을 연 채 시작

빌드 없이 정적 파일 그대로 배포합니다 (Vercel: Framework Preset = Other).
