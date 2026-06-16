
-- push_subscriptions: explicit no-access policies for anon/authenticated (service_role bypasses RLS)
REVOKE ALL ON public.push_subscriptions FROM anon, authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;

CREATE POLICY "No client read access to push subscriptions"
  ON public.push_subscriptions FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "No client insert access to push subscriptions"
  ON public.push_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "No client update access to push subscriptions"
  ON public.push_subscriptions FOR UPDATE
  TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "No client delete access to push subscriptions"
  ON public.push_subscriptions FOR DELETE
  TO anon, authenticated
  USING (false);

-- user_roles: only admins can write; users already can read their own
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
