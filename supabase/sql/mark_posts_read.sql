-- 投稿を既読にする関数(BBS)
-- read_by に自分のIDを DB 側で追加する。複数人が同時に既読を付けても上書きで消えない。
-- Supabase ダッシュボード > SQL Editor で1回実行してください。
-- 未作成の間は、画面側が従来の方法(読み込み→追加→書き戻し)で既読にする。
create or replace function public.mark_posts_read(post_ids uuid[])
returns void
language sql
security definer
set search_path = public
as $$
  update public.posts
     set read_by = array_append(coalesce(read_by, '{}'), auth.uid()::text)
   where id = any(post_ids)
     and auth.uid() is not null
     and user_uid is distinct from auth.uid()::text           -- 自分の投稿は対象外
     and not (coalesce(read_by, '{}') @> array[auth.uid()::text]); -- 既読済みは対象外
$$;

-- ログイン中のユーザーだけが実行できる(自分のIDを追加することしかできない)
revoke all on function public.mark_posts_read(uuid[]) from public, anon;
grant execute on function public.mark_posts_read(uuid[]) to authenticated;
