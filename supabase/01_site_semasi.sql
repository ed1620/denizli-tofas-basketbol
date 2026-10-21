-- =====================================================================
-- İNTERNET SİTESİ VERİLERİ (web_* tabloları)
-- DİBA mobil uygulamasıyla aynı Supabase projesinde, ayrı tablolarda durur.
-- Herkes okuyabilir (site), yalnız kulüp YÖNETİCİSİ yazabilir (panel).
-- Yönetici kontrolü mobil uygulamanın private.is_admin() fonksiyonuyla yapılır,
-- yani panele uygulamadaki yönetici hesabıyla (telefon + şifre) girilir.
--
-- Supabase → SQL Editor'da bir kez çalıştırılır. Tekrar çalıştırmak güvenlidir.
-- =====================================================================

-- ---------- Tablolar ----------
create table if not exists public.web_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.web_teams (
  id           text primary key check (id ~ '^[a-z0-9-]+$'),
  name         text not null,                 -- kısa ad: "U14"
  full_name    text not null,                 -- sayfa başlığı: "U14 Erkek"
  group_code   text not null,                 -- haber eşlemesi: "u16" (U16 A ve B ortak)
  years_label  text,                          -- "2013–2014 doğumlu"
  age_label    text,                          -- "12–13 yaş"
  birth_years  int[] not null default '{}',   -- ön kayıt formundaki grup önerisi
  note         text,
  league       text,                          -- "Denizli U14 Erkekler" (yoksa boş)
  tbf_url      text,
  photo_url    text,
  sort         int not null default 0,
  is_active    boolean not null default true,
  updated_at   timestamptz not null default now()
);

create table if not exists public.web_opponents (
  id          text primary key check (id ~ '^[a-z0-9-]+$'),
  name        text not null,
  logo_url    text,
  updated_at  timestamptz not null default now()
);

create table if not exists public.web_venues (
  id              text primary key check (id ~ '^[a-z0-9-]+$'),
  name            text not null,
  short_name      text,
  use_text        text,
  address         text,
  capacity        text,
  maps_embed      text,                       -- Google Haritası embed adresi
  directions_url  text,
  photo_url       text,
  listed          boolean not null default true,  -- "Antrenman Salonlarımız" sayfasında görünsün mü
  sort            int not null default 0,
  updated_at      timestamptz not null default now()
);

create table if not exists public.web_players (
  id          text primary key check (id ~ '^[a-z0-9-]+$'),
  team_id     text references public.web_teams (id) on update cascade on delete set null,
  name        text not null,
  born        smallint check (born between 1990 and 2030),  -- yalnız doğum yılı (KVKK)
  number      smallint check (number between 0 and 99),
  position    text,
  photo_url   text,
  bio         text,
  sort        int not null default 0,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table if not exists public.web_coaches (
  id          text primary key check (id ~ '^[a-z0-9-]+$'),
  name        text not null,
  title       text not null,
  photo_url   text,
  bio         text,
  social      jsonb not null default '{}',    -- { "instagram": "...", "x": "...", "linkedin": "..." }
  sort        int not null default 0,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table if not exists public.web_matches (
  id                text primary key default gen_random_uuid()::text,
  code              text,                     -- TBF maç no: "BTO986"
  team_id           text not null references public.web_teams (id) on update cascade on delete cascade,
  opponent_id       text references public.web_opponents (id) on update cascade on delete set null,
  opponent_team_id  text references public.web_teams (id) on update cascade on delete set null, -- kulüp içi maç (U16 B - U16 A)
  opponent_name     text,                     -- rakip listede yoksa serbest ad
  is_home           boolean not null default true,
  competition       text,                     -- "Denizli U14 Erkekler"
  week              text,                     -- "1. Hafta"
  match_date        date not null,
  match_time        time,
  venue_id          text references public.web_venues (id) on update cascade on delete set null,
  our_score         smallint check (our_score >= 0),
  their_score       smallint check (their_score >= 0),
  status            text not null default 'scheduled' check (status in ('scheduled', 'completed', 'postponed', 'cancelled')),
  notes             text,
  updated_at        timestamptz not null default now()
);
create index if not exists web_matches_date_idx on public.web_matches (match_date, match_time);

create table if not exists public.web_posts (
  id            text primary key default gen_random_uuid()::text,  -- Instagram gönderilerinde gönderi kodu
  post_date     date not null,
  type          text not null default 'photo' check (type in ('photo', 'album', 'video', 'poster')),
  cat           text not null default 'duyuru' check (cat in ('mac', 'antrenman', 'duyuru', 'etkinlik')),
  title         text not null,
  body          text,
  image_url     text,
  link_url      text,                         -- Instagram gönderisi vb.
  groups        text[] not null default '{}', -- ilgili takım grupları (takım sayfalarında görünür)
  via           text,
  is_published  boolean not null default true,
  updated_at    timestamptz not null default now()
);
create index if not exists web_posts_date_idx on public.web_posts (post_date desc);

create table if not exists public.web_faq (
  id          text primary key default gen_random_uuid()::text,
  question    text not null,
  answer      text,
  sort        int not null default 0,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ---------- updated_at ----------
do $$
declare t text;
begin
  foreach t in array array['web_settings','web_teams','web_opponents','web_venues','web_players','web_coaches','web_matches','web_posts','web_faq'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
  end loop;
end $$;

-- ---------- Güvenlik (RLS): herkes okur, yalnız yönetici yazar ----------
do $$
declare t text;
begin
  foreach t in array array['web_settings','web_teams','web_opponents','web_venues','web_players','web_coaches','web_matches','web_posts','web_faq'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "site herkese açık" on public.%I', t);
    execute format('drop policy if exists "yönetici ekler" on public.%I', t);
    execute format('drop policy if exists "yönetici düzenler" on public.%I', t);
    execute format('drop policy if exists "yönetici siler" on public.%I', t);
    execute format('create policy "site herkese açık" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "yönetici ekler" on public.%I for insert to authenticated with check (private.is_admin())', t);
    execute format('create policy "yönetici düzenler" on public.%I for update to authenticated using (private.is_admin()) with check (private.is_admin())', t);
    execute format('create policy "yönetici siler" on public.%I for delete to authenticated using (private.is_admin())', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- Panel, giriş yapan kişinin yönetici olup olmadığını bu fonksiyonla sorar
create or replace function public.web_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(private.is_admin(), false)
$$;
grant execute on function public.web_is_admin() to authenticated;

-- ---------- Görsel deposu: "web-media" (herkes görür, yönetici yükler) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('web-media', 'web-media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site görseli yükleme" on storage.objects;
drop policy if exists "site görseli güncelleme" on storage.objects;
drop policy if exists "site görseli silme" on storage.objects;
create policy "site görseli yükleme" on storage.objects for insert to authenticated
  with check (bucket_id = 'web-media' and private.is_admin());
create policy "site görseli güncelleme" on storage.objects for update to authenticated
  using (bucket_id = 'web-media' and private.is_admin());
create policy "site görseli silme" on storage.objects for delete to authenticated
  using (bucket_id = 'web-media' and private.is_admin());
