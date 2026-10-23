-- =====================================================================
-- U14 KADRO GÜNCELLEMESİ (TBF) + Muzaffer Bozdemir doğum yılı
-- Oyuncu fotoğrafları veli onayı alınana kadar yalnız yerelde (assets/players/, git dışı).
-- MUZAFFER BOZDEMİR: TBF'de U14 lisanslı (23.04.2014), U16 B'de oynuyor.
-- Supabase → SQL Editor'da bir kez çalıştırılır. Tekrar çalıştırmak güvenlidir.
-- =====================================================================
begin;
update public.web_players set born = 2014 where id = 'muzaffer-bozdemir';

insert into public.web_players (id, team_id, name, born, sort) values ('aras-guclu', 'u14', 'ARAS GÜÇLÜ', 2014, 0) on conflict (id) do nothing;
insert into public.web_players (id, team_id, name, born, sort) values ('umut-adar-ozdemir', 'u14', 'UMUT ADAR ÖZDEMİR', 2014, 0) on conflict (id) do nothing;
commit;

-- Kontrol
select team_id, count(*) as oyuncu from public.web_players group by 1 order by 1;
