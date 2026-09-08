-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'किसान',
  avatar_url text,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are public" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- POSTS
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  crop text NOT NULL DEFAULT 'अन्य',
  category text NOT NULL DEFAULT 'अन्य',
  images text[] NOT NULL DEFAULT '{}',
  location text,
  like_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX community_posts_created_idx ON public.community_posts (created_at DESC);
CREATE INDEX community_posts_user_idx ON public.community_posts (user_id);
GRANT SELECT ON public.community_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are public" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users create own posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON public.community_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON public.community_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER community_posts_set_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- COMMENTS
CREATE TABLE public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  body text NOT NULL,
  like_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX community_comments_post_idx ON public.community_comments (post_id, created_at);
GRANT SELECT ON public.community_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_comments TO authenticated;
GRANT ALL ON public.community_comments TO service_role;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are public" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Users create own comments" ON public.community_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own comments" ON public.community_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users or post owner delete comments" ON public.community_comments FOR DELETE TO authenticated USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.community_posts p WHERE p.id = post_id AND p.user_id = auth.uid())
);
CREATE TRIGGER community_comments_set_updated_at BEFORE UPDATE ON public.community_comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- POST LIKES
CREATE TABLE public.community_post_likes (
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
GRANT SELECT ON public.community_post_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.community_post_likes TO authenticated;
GRANT ALL ON public.community_post_likes TO service_role;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Post likes are public" ON public.community_post_likes FOR SELECT USING (true);
CREATE POLICY "Users like as self" ON public.community_post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike own" ON public.community_post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- COMMENT LIKES
CREATE TABLE public.community_comment_likes (
  comment_id uuid NOT NULL REFERENCES public.community_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, user_id)
);
GRANT SELECT ON public.community_comment_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.community_comment_likes TO authenticated;
GRANT ALL ON public.community_comment_likes TO service_role;
ALTER TABLE public.community_comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comment likes are public" ON public.community_comment_likes FOR SELECT USING (true);
CREATE POLICY "Users like comments as self" ON public.community_comment_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike comments own" ON public.community_comment_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- REPORTS
CREATE TABLE public.community_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.community_reports TO authenticated;
GRANT ALL ON public.community_reports TO service_role;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users create reports" ON public.community_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins read reports" ON public.community_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- COUNTER TRIGGERS
CREATE OR REPLACE FUNCTION public.community_sync_post_likes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSE
    UPDATE public.community_posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER community_post_likes_count AFTER INSERT OR DELETE ON public.community_post_likes
FOR EACH ROW EXECUTE FUNCTION public.community_sync_post_likes();

CREATE OR REPLACE FUNCTION public.community_sync_comment_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSE
    UPDATE public.community_posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER community_comments_count AFTER INSERT OR DELETE ON public.community_comments
FOR EACH ROW EXECUTE FUNCTION public.community_sync_comment_count();

CREATE OR REPLACE FUNCTION public.community_sync_comment_likes()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
  ELSE
    UPDATE public.community_comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER community_comment_likes_count AFTER INSERT OR DELETE ON public.community_comment_likes
FOR EACH ROW EXECUTE FUNCTION public.community_sync_comment_likes();

-- STORAGE POLICIES for community images bucket
CREATE POLICY "Community images are public" ON storage.objects FOR SELECT USING (bucket_id = 'community');
CREATE POLICY "Users upload own community images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'community' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own community images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'community' AND (storage.foldername(name))[1] = auth.uid()::text);
