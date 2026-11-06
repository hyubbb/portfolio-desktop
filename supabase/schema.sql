-- portfolio-desktop: 관리자 편집 기능용 테이블과 권한
-- Supabase 대시보드 → SQL Editor 에 붙여 넣고 실행하세요.
-- 아래 이메일을 관리자 계정 이메일로 바꿔서 실행하세요 (3곳).

create table if not exists public.site_content (
  id text primary key,                 -- 'desktop'(바탕화면 구성) | 'readme'(README 내용)
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- 누구나 읽기 (사이트 방문자)
drop policy if exists "site_content readable by everyone" on public.site_content;
create policy "site_content readable by everyone"
  on public.site_content for select
  using (true);

-- 관리자 계정만 쓰기
drop policy if exists "site_content insert by admin" on public.site_content;
create policy "site_content insert by admin"
  on public.site_content for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'dlckdguq1011@naver.com');

drop policy if exists "site_content update by admin" on public.site_content;
create policy "site_content update by admin"
  on public.site_content for update to authenticated
  using ((auth.jwt() ->> 'email') = 'dlckdguq1011@naver.com')
  with check ((auth.jwt() ->> 'email') = 'dlckdguq1011@naver.com');
