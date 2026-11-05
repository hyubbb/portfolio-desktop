import type { DesktopItem } from "./types";

/**
 * 바탕화면에 놓이는 항목. 새 작업은 여기에 한 줄 추가하면
 * 바탕화면 아이콘, 독, 창, #해시 바로가기가 함께 생긴다.
 */
export const DESKTOP_ITEMS: DesktopItem[] = [
  {
    id: "about",
    kind: "readme",
    name: "README",
    title: { ko: "README — 이창협", ja: "README — イ・チャンヒョップ" },
    size: { width: 520, height: 420 },
  },
  {
    id: "github",
    kind: "github",
    user: "hyubbb",
    name: "GitHub",
    title: "hyubbb — GitHub",
    size: { width: 920, height: 620 },
  },
  {
    id: "fastlane",
    kind: "page",
    src: "/projects/fastlane.html",
    name: "fastlane",
    title: { ko: "fastlane — 셸 스크립트 배포와 fastlane 배포", ja: "fastlane — シェルスクリプトと fastlane のデプロイ比較" },
    size: { width: 1180, height: 1100 },
  },
  {
    id: "work",
    kind: "folder",
    name: { ko: "업무 개선", ja: "業務改善" },
    title: { ko: "업무 개선", ja: "業務改善" },
    size: { width: 720, height: 430 },
  },
  {
    id: "streaming",
    parent: "work",
    kind: "page",
    src: "/projects/streaming.html",
    color: "#6b4fbb",
    glyph: "stream",
    name: { ko: "AI 스트리밍", ja: "AI ストリーミング" },
    title: { ko: "AI 답변 스트리밍 안정화", ja: "AI 回答ストリーミングの安定化" },
    description: {
      ko: "seq 가드·이어받기·이중 워치독으로 끊겨도 이어지는 AI 답변",
      ja: "seq ガード・再取得・二重ウォッチドッグで切れても続く AI 回答",
    },
    size: { width: 1180, height: 1100 },
  },
  {
    id: "pdf-range",
    parent: "work",
    kind: "page",
    src: "/projects/pdf-range.html",
    color: "#c2410c",
    glyph: "pdf",
    name: { ko: "PDF 부분 로딩", ja: "PDF 部分読み込み" },
    title: { ko: "PDF 부분 로딩 — 50초에서 6초로", ja: "PDF 部分読み込み — 50 秒から 6 秒へ" },
    description: {
      ko: "Range Request로 첫 페이지 약 50초 → 6~7초, 로딩 문의 주 3건 → 0건",
      ja: "Range Request で 1 ページ目が約 50 秒 → 6〜7 秒、問い合わせ週 3 件 → 0 件",
    },
    size: { width: 1180, height: 1100 },
  },
  {
    id: "presigned-upload",
    parent: "work",
    kind: "page",
    src: "/projects/presigned-upload.html",
    color: "#0f766e",
    glyph: "upload",
    name: { ko: "직접 업로드", ja: "直接アップロード" },
    title: { ko: "파일 업로드 경로 바꾸기 — 30초에서 3초로", ja: "アップロード経路の変更 — 30 秒から 3 秒へ" },
    description: {
      ko: "presigned URL로 스토리지에 직접 올려 30~40초 → 3~4초",
      ja: "presigned URL でストレージへ直接アップロードし 30〜40 秒 → 3〜4 秒",
    },
    size: { width: 1180, height: 1100 },
  },
  {
    id: "lecture-upload",
    parent: "work",
    kind: "page",
    src: "/projects/lecture-upload.html",
    color: "#1d4ed8",
    glyph: "engine",
    name: { ko: "업로드 엔진", ja: "アップロードエンジン" },
    title: { ko: "강의 업로드 엔진", ja: "講義アップロードエンジン" },
    description: {
      ko: "레이아웃에 상주하는 9단계 상태 머신, 페이지를 옮겨도 업로드 유지",
      ja: "レイアウトに常駐する 9 段階のステートマシン、ページ移動中も継続",
    },
    size: { width: 1180, height: 1100 },
  },
  {
    id: "lab",
    kind: "folder",
    name: { ko: "실험실", ja: "実験室" },
    title: { ko: "실험실", ja: "実験室" },
    size: { width: 640, height: 380 },
  },
  {
    id: "talk-recap",
    parent: "lab",
    kind: "project",
    url: "https://talk-recap.vercel.app",
    color: "#e0a91b",
    glyph: "chat",
    name: "talk-recap",
    title: { ko: "talk-recap — 카톡 대화 분석", ja: "talk-recap — カカオトーク会話分析" },
    description: {
      ko: "카톡 대화 파일을 올리면 멤버 분석, 관계, MBTI 추론을 보여 주는 웹 서비스",
      ja: "カカオトークの履歴をアップロードすると、メンバー分析・関係性・MBTI 推定を表示する Web サービス",
    },
    size: { width: 1100, height: 760 },
  },
  {
    id: "drink-sakaba",
    parent: "lab",
    kind: "project",
    url: "https://drink-sakaba.vercel.app",
    color: "#c0392b",
    glyph: "cup",
    name: "drink-sakaba",
    title: { ko: "drink-sakaba — 온라인 혼술집", ja: "drink-sakaba — オンライン酒場" },
    description: {
      ko: "모르는 사람끼리 마주 앉아 술을 따라 주는 다인원 온라인 혼술집",
      ja: "知らない人同士が向かい合ってお酒を注ぎ合う、多人数オンライン酒場",
    },
    size: { width: 1100, height: 760 },
  },
  {
    id: "knitgrid",
    parent: "lab",
    kind: "project",
    url: "https://knitgrid.vercel.app",
    color: "#2e8b6e",
    glyph: "grid",
    name: "knitgrid",
    title: { ko: "knitgrid — 뜨개 도안 만들기", ja: "knitgrid — 編み物の図案づくり" },
    description: {
      ko: "이미지나 빈 격자에서 시작해 뜨개·비즈 패턴 도안을 만드는 도구",
      ja: "画像や空のグリッドから編み物・ビーズの図案を作るツール",
    },
    size: { width: 1100, height: 760 },
  },
];

const byId = new Map(DESKTOP_ITEMS.map((item) => [item.id, item]));

export const getItem = (id: string) => byId.get(id);
/** 바탕화면·독에 바로 놓이는 항목 (폴더 안 항목 제외) */
export const getRootItems = () => DESKTOP_ITEMS.filter((item) => !item.parent);
export const getChildren = (folderId: string) => DESKTOP_ITEMS.filter((item) => item.parent === folderId);
