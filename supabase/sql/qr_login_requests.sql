-- QRコードでスマホにログインする機能(PCでの承認付き)用のテーブル
-- Supabase ダッシュボード > SQL Editor で1回実行してください。
create table if not exists public.qr_login_requests (
  id          uuid primary key default gen_random_uuid(),
  nonce       text not null,                       -- どのQR表示から来たか
  user_id     uuid not null references auth.users(id) on delete cascade,
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'denied', 'consumed')),
  secret_hash text not null,                       -- スマホだけが知る秘密値のハッシュ
  user_agent  text,
  token_hash  text,                                -- 承認後〜スマホが受け取るまでの間だけ保持
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);

create index if not exists qr_login_requests_nonce_idx
  on public.qr_login_requests (nonce);

-- サーバー(service role)からのみ操作する。一般ユーザーからは読み書き不可。
alter table public.qr_login_requests enable row level security;
