-- =====================================================================
-- DİBA MOBİL UYGULAMASI: ÖRNEK (DEMO) VERİLERİN SİLİNMESİ
-- Mobil uygulamanın "npm run seed:demo -- --reset" komutunun yaptığının aynısı:
-- kulübün grupları, sporcuları (yoklama/aidat/maç kayıtlarıyla birlikte),
-- duyuruları, bildirimleri ve demo hesapları (telefonu 555 000 ile başlayanlar).
-- Kulüp kaydı, gerçek yönetici hesabı ve web_* site tabloları SİLİNMEZ.
--
-- 1. adım: aşağıdaki SELECT'i tek başına çalıştırıp ne silineceğini görün.
-- 2. adım: DELETE bloğunu çalıştırın.
-- =====================================================================

-- 1) Önizleme
select
  (select count(*) from public.groups)        as gruplar,
  (select count(*) from public.athletes)      as sporcular,
  (select count(*) from public.matches)       as mac_kayitlari,
  (select count(*) from public.announcements) as duyurular,
  (select count(*) from public.notifications) as bildirimler,
  (select count(*) from auth.users where email like '555000%@tel.kulup.app') as demo_hesaplar,
  (select count(*) from public.profiles where role = 'admin' and phone not like '555000%') as korunan_yoneticiler;

-- 2) Silme
begin;
delete from public.notifications;
delete from public.announcements;
delete from public.athletes;   -- yoklama, aidat, veli bağları, maç kadroları zincirleme silinir
delete from public.groups;     -- grup programları, antrenör atamaları ve maçlar zincirleme silinir
delete from auth.users where email like '555000%@tel.kulup.app';   -- demo yönetici, antrenör ve veliler (profilleriyle)
commit;
