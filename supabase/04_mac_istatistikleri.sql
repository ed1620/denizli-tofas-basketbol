-- =====================================================================
-- MAÇ İSTATİSTİKLERİ + U16 1. HAFTA (23.10.2026)
-- 1) web_matches'e periyot skorları ve TBF maç bağlantısı, yeni web_match_stats tablosu
-- 2) U16 A / U16 B kadroları TBF maç kâğıtlarına göre ayrılır, forma numaraları girilir
-- 3) AMI579 ve AMI580 skorları ve oyuncu istatistikleri (kaynak: TBF maç istatistikleri)
-- Supabase → SQL Editor'da bir kez çalıştırılır. Tekrar çalıştırmak güvenlidir.
-- =====================================================================

-- ---------- Şema ----------
alter table public.web_matches add column if not exists quarters jsonb;   -- {"ours":[..], "theirs":[..]}
alter table public.web_matches add column if not exists tbf_url text;

create table if not exists public.web_match_stats (
  id           bigint generated always as identity primary key,
  match_id     text not null references public.web_matches (id) on update cascade on delete cascade,
  player_id    text references public.web_players (id) on update cascade on delete set null,
  player_name  text not null,
  jersey       text,
  starter      boolean not null default false,
  captain      boolean not null default false,
  minutes      text,                       -- "20:41"
  pts smallint not null default 0,
  fgm smallint not null default 0, fga smallint not null default 0,
  p2m smallint not null default 0, p2a smallint not null default 0,
  p3m smallint not null default 0, p3a smallint not null default 0,
  ftm smallint not null default 0, fta smallint not null default 0,
  oreb smallint not null default 0, dreb smallint not null default 0, reb smallint not null default 0,
  ast smallint not null default 0, tov smallint not null default 0, stl smallint not null default 0,
  blk smallint not null default 0, pf smallint not null default 0, fd smallint not null default 0,
  plus_minus smallint not null default 0,
  eff smallint not null default 0,         -- verimlilik (TBF VP)
  sort int not null default 0,
  updated_at timestamptz not null default now(),
  unique (match_id, player_name)
);
create index if not exists web_match_stats_player_idx on public.web_match_stats (player_id);

drop trigger if exists web_match_stats_updated_at on public.web_match_stats;
create trigger web_match_stats_updated_at before update on public.web_match_stats for each row execute function public.set_updated_at();

alter table public.web_match_stats enable row level security;
drop policy if exists "site herkese açık" on public.web_match_stats;
drop policy if exists "yönetici ekler" on public.web_match_stats;
drop policy if exists "yönetici düzenler" on public.web_match_stats;
drop policy if exists "yönetici siler" on public.web_match_stats;
create policy "site herkese açık" on public.web_match_stats for select to anon, authenticated using (true);
create policy "yönetici ekler" on public.web_match_stats for insert to authenticated with check (private.is_admin());
create policy "yönetici düzenler" on public.web_match_stats for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "yönetici siler" on public.web_match_stats for delete to authenticated using (private.is_admin());
grant select on public.web_match_stats to anon, authenticated;
grant insert, update, delete on public.web_match_stats to authenticated;

begin;

-- ---------- Kadrolar: maç kâğıdına göre A / B ----------
insert into public.web_players (id, team_id, name, born, number, sort) values ('muzaffer-bozdemir', 'u16b', 'MUZAFFER BOZDEMİR', null, 8, 0)
  on conflict (id) do update set team_id = excluded.team_id, number = excluded.number;
update public.web_players set team_id = 'u16a', number = 2 where id = 'mustafa-mert-oneri';
update public.web_players set team_id = 'u16a', number = 5 where id = 'asim-yigit-gurler';
update public.web_players set team_id = 'u16a', number = 9 where id = 'omer-mete-gok';
update public.web_players set team_id = 'u16a', number = 11 where id = 'ahmet-efe-yildiran';
update public.web_players set team_id = 'u16a', number = 23 where id = 'salih-mert-yavas';
update public.web_players set team_id = 'u16a', number = 0 where id = 'kayra-demir-ozdemir';
update public.web_players set team_id = 'u16a', number = 17 where id = 'talha-efe-celik';
update public.web_players set team_id = 'u16a', number = 19 where id = 'mert-ercan';
update public.web_players set team_id = 'u16a', number = 20 where id = 'ahmet-teke';
update public.web_players set team_id = 'u16a', number = 83 where id = 'emir-cansuz';
update public.web_players set team_id = 'u16b', number = 8 where id = 'muzaffer-bozdemir';
update public.web_players set team_id = 'u16b', number = 12 where id = 'egemen-erten';
update public.web_players set team_id = 'u16b', number = 21 where id = 'mustafa-yigit-goven';
update public.web_players set team_id = 'u16b', number = 88 where id = 'umut-eren-ozbudak';
update public.web_players set team_id = 'u16b', number = 99 where id = 'aras-koknar';
update public.web_players set team_id = 'u16b', number = 4 where id = 'tuncay-ege-bilgic';
update public.web_players set team_id = 'u16b', number = 14 where id = 'resat-cinar-hilinc';
update public.web_players set team_id = 'u16b', number = 24 where id = 'mustafa-eren-yagci';
update public.web_players set team_id = 'u16b', number = 32 where id = 'ahmet-eren-tenekeci';
update public.web_players set team_id = 'u16b', number = 42 where id = 'ismail-aras-degirmenci';
update public.web_players set team_id = 'u16b', number = 45 where id = 'mehmet-cinar-kaya';

-- ---------- AMI579 ----------
update public.web_matches set our_score = 27, their_score = 108, status = 'completed',
  quarters = '{"ours": [6, 4, 8, 9], "theirs": [33, 24, 18, 33]}', tbf_url = 'https://tbf.org.tr/ligler/22620/mac-detay/351720' where id = 'ami579';
delete from public.web_match_stats where match_id = 'ami579';
insert into public.web_match_stats (match_id, player_id, player_name, jersey, starter, captain, minutes, pts, fgm, fga, p2m, p2a, p3m, p3a, ftm, fta, oreb, dreb, reb, ast, tov, stl, blk, pf, fd, plus_minus, eff, sort) values
  ('ami579', 'mustafa-mert-oneri', 'Mustafa Mert Öneri', '2', true, true, '20:41', 1, 0, 6, 0, 5, 0, 1, 1, 2, 0, 2, 2, 0, 4, 1, 0, 0, 1, -35, -7, 0),
  ('ami579', 'asim-yigit-gurler', 'Asım Yiğit Gürler', '5', true, false, '30:58', 3, 1, 3, 1, 2, 0, 1, 1, 2, 1, 0, 1, 0, 3, 0, 0, 2, 1, -79, -2, 1),
  ('ami579', 'omer-mete-gok', 'Ömer Mete Gök', '9', true, false, '28:41', 8, 4, 10, 4, 9, 0, 1, 0, 7, 1, 4, 5, 0, 1, 0, 0, 4, 8, -60, -1, 2),
  ('ami579', 'ahmet-efe-yildiran', 'Ahmet Efe Yıldıran', '11', true, false, '13:11', 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 2, 0, 0, 2, 3, -23, -2, 3),
  ('ami579', 'salih-mert-yavas', 'Salih Mert Yavaş', '23', true, false, '20:44', 0, 0, 5, 0, 4, 0, 1, 0, 0, 0, 1, 1, 0, 3, 0, 0, 0, 1, -50, -7, 4),
  ('ami579', 'kayra-demir-ozdemir', 'Kayra Demir Özdemir', '00', false, false, '25:30', 7, 2, 3, 1, 2, 1, 1, 2, 6, 0, 1, 1, 0, 3, 1, 0, 0, 4, -48, 1, 5),
  ('ami579', 'talha-efe-celik', 'Talha Efe Çelik', '17', false, false, '18:49', 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, -36, 3, 6),
  ('ami579', 'mert-ercan', 'Mert Ercan', '19', false, false, '8:27', 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, -10, -1, 7),
  ('ami579', 'ahmet-teke', 'Ahmet Teke', '20', false, false, '8:43', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, -9, 0, 8),
  ('ami579', 'emir-cansuz', 'Emir Cansuz', '83', false, false, '24:16', 6, 3, 6, 3, 5, 0, 1, 0, 2, 1, 2, 3, 0, 5, 0, 0, 0, 1, -55, -1, 9);

-- ---------- AMI580 ----------
update public.web_matches set our_score = 49, their_score = 99, status = 'completed',
  quarters = '{"ours": [9, 23, 7, 10], "theirs": [28, 34, 18, 19]}', tbf_url = 'https://tbf.org.tr/ligler/22620/mac-detay/351721' where id = 'ami580';
delete from public.web_match_stats where match_id = 'ami580';
insert into public.web_match_stats (match_id, player_id, player_name, jersey, starter, captain, minutes, pts, fgm, fga, p2m, p2a, p3m, p3a, ftm, fta, oreb, dreb, reb, ast, tov, stl, blk, pf, fd, plus_minus, eff, sort) values
  ('ami580', 'muzaffer-bozdemir', 'Muzaffer Bozdemir', '8', true, false, '30:43', 13, 6, 16, 5, 12, 1, 4, 0, 2, 0, 4, 4, 0, 9, 0, 0, 1, 2, -44, -4, 0),
  ('ami580', 'egemen-erten', 'Egemen Erten', '12', true, true, '34:49', 4, 2, 10, 2, 6, 0, 4, 0, 2, 2, 3, 5, 1, 3, 1, 0, 3, 3, -44, -2, 1),
  ('ami580', 'mustafa-yigit-goven', 'Mustafa Yiğit Göven', '21', true, false, '12:32', 3, 1, 2, 0, 0, 1, 2, 0, 0, 0, 1, 1, 1, 1, 0, 0, 2, 0, -19, 3, 2),
  ('ami580', 'umut-eren-ozbudak', 'Umut Eren Özbudak', '88', true, false, '34:49', 12, 4, 10, 4, 8, 0, 2, 4, 13, 1, 7, 8, 0, 4, 0, 0, 3, 8, -42, 1, 3),
  ('ami580', 'aras-koknar', 'Aras Köknar', '99', true, false, '23:31', 9, 3, 6, 1, 1, 2, 5, 1, 4, 0, 2, 2, 0, 0, 1, 0, 3, 3, -26, 6, 4),
  ('ami580', 'tuncay-ege-bilgic', 'Tuncay Ege Bilgiç', '4', false, false, '23:21', 5, 2, 5, 2, 3, 0, 2, 1, 3, 0, 1, 1, 0, 1, 0, 0, 4, 1, -29, 0, 5),
  ('ami580', 'resat-cinar-hilinc', 'Reşat Çınar Hılınç', '14', false, false, '8:47', 2, 1, 2, 1, 2, 0, 0, 0, 2, 1, 0, 1, 0, 2, 0, 0, 1, 1, -11, -2, 6),
  ('ami580', 'mustafa-eren-yagci', 'Mustafa Eren Yağcı', '24', false, false, '15:20', 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 5, 5, 0, 2, 0, 0, 0, 0, -18, 1, 7),
  ('ami580', 'ahmet-eren-tenekeci', 'Ahmet Eren Tenekeci', '32', false, false, '0:00', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8),
  ('ami580', 'ismail-aras-degirmenci', 'İsmail Aras Değirmenci', '42', false, false, '9:28', 1, 0, 2, 0, 2, 0, 0, 1, 2, 0, 2, 2, 0, 2, 0, 0, 0, 1, -9, -2, 9),
  ('ami580', 'mehmet-cinar-kaya', 'Mehmet Çınar Kaya', '45', false, false, '6:40', 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, -8, -2, 10);

commit;

-- Kontrol
select team_id, count(*) from public.web_players where team_id in ('u16a', 'u16b') group by 1;
select id, our_score, their_score, status from public.web_matches where id in ('ami579', 'ami580');
select match_id, count(*), sum(pts) from public.web_match_stats group by 1;
