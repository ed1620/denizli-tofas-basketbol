-- =====================================================================
-- DİBA MOBİL UYGULAMASI: ÖRNEK (DEMO) VERİLERİN SİLİNMESİ
-- Yalnız demo betiğinin (seed:demo, 18.10.2026) oluşturduğu kayıtlar silinir:
-- 4 grup, 40 sporcu (yoklama/aidat/veli bağları/maç kadrolarıyla), 21 maç ve
-- telefonu 555 000 ile başlayan 66 demo hesap (profilleri ve bildirimleriyle).
--
-- KORUNANLAR: kulüp kaydı, gerçek yönetici ve veli hesapları, gerçek kullanıcının
-- duyurusu ("Cuma günü maç var!!!!") ve web_* site tabloları.
-- Gerçek hesaplara giden ama silinen maç/sporcu/aidata bağlı bildirimler de silinir
-- (uygulamada açılmayan ölü bağlantı kalmasın).
-- =====================================================================

-- 1) Önizleme
select
  (select count(*) from public.groups   where created_at::date = '2026-10-18') as demo_gruplar,
  (select count(*) from public.athletes where created_at::date = '2026-10-18') as demo_sporcular,
  (select count(*) from auth.users where email like '555000%@tel.kulup.app')   as demo_hesaplar;

-- 2) Silme
begin;
delete from public.athletes where created_at::date = '2026-10-18';   -- yoklama, aidat, veli bağları, kadrolar zincirleme
delete from public.groups   where created_at::date = '2026-10-18';   -- maçlar, programlar, antrenör atamaları zincirleme
delete from auth.users where email like '555000%@tel.kulup.app';     -- demo hesaplar; profilleri ve bildirimleri zincirleme

-- Silinen kayıtlara bağlanan bildirimler (gerçek hesaplarda)
delete from public.notifications n
where (n.data ? 'match_id'   and not exists (select 1 from public.matches  m where m.id::text = n.data->>'match_id'))
   or (n.data ? 'athlete_id' and not exists (select 1 from public.athletes a where a.id::text = n.data->>'athlete_id'))
   or (n.data ? 'fee_id'     and not exists (select 1 from public.fees     f where f.id::text = n.data->>'fee_id'));
commit;

-- 3) Kontrol
select
  (select count(*) from public.groups) as gruplar,
  (select count(*) from public.athletes) as sporcular,
  (select count(*) from public.matches) as maclar,
  (select count(*) from public.announcements) as duyurular,
  (select count(*) from auth.users) as hesaplar;
