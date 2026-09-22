-- These are trigger functions, never meant to be called directly. Supabase
-- exposes public-schema functions over PostgREST (/rest/v1/rpc/...), so
-- without this they would be callable by any client.
--
-- Postgres checks EXECUTE when a trigger is created, not when it fires, so
-- the existing triggers keep working.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.touch_updated_at() from anon, authenticated, public;
