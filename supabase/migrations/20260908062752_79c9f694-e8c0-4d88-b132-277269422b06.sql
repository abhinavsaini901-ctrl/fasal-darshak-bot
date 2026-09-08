REVOKE ALL ON FUNCTION public.community_sync_post_likes() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.community_sync_comment_count() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.community_sync_comment_likes() FROM anon, authenticated, public;