import { supabase } from "@/integrations/supabase/client";

export const COMMUNITY_BUCKET = "community";

export const CROPS = [
  "गेहूं",
  "धान",
  "कपास",
  "सरसों",
  "सोयाबीन",
  "मक्का",
  "टमाटर",
  "आलू",
  "सब्जियां",
  "फल",
  "अन्य",
] as const;

export const CATEGORIES = [
  "रोग/कीट",
  "फसल सलाह",
  "मंडी भाव",
  "सरकारी योजना",
  "अन्य",
] as const;

/** Filter chips shown above the feed (crop + category mixed, like a social app). */
export const FILTERS = [
  "सभी",
  ...CROPS.filter((c) => c !== "अन्य"),
  "रोग/कीट",
  "मंडी भाव",
  "अन्य",
] as const;

export const REPORT_REASONS = ["Spam", "गलत जानकारी", "अपमानजनक सामग्री", "अन्य"] as const;

export type CommunityProfile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  location: string | null;
};

export type CommunityPost = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  crop: string;
  category: string;
  images: string[];
  location: string | null;
  like_count: number;
  comment_count: number;
  created_at: string;
  profiles?: CommunityProfile | null;
};

export type CommunityComment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  like_count: number;
  created_at: string;
  profiles?: CommunityProfile | null;
};

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/** Shrinks a phone photo so uploads stay small and fast on rural connections. */
export async function compressImage(file: File, maxSide = 1400, quality = 0.82): Promise<Blob> {
  if (!ALLOWED_TYPES.includes(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), "image/jpeg", quality),
    );
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

export function isAllowedImage(file: File) {
  return ALLOWED_TYPES.includes(file.type);
}

/** Uploads images under <userId>/... and returns their storage paths. */
export async function uploadPostImages(userId: string, files: File[]): Promise<string[]> {
  const paths: string[] = [];
  for (const file of files) {
    const blob = await compressImage(file);
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const { error } = await supabase.storage
      .from(COMMUNITY_BUCKET)
      .upload(path, blob, { contentType: "image/jpeg", upsert: false });
    if (error) throw new Error(error.message);
    paths.push(path);
  }
  return paths;
}

/** Resolves storage paths to temporary viewable URLs. */
export async function signImageUrls(paths: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(paths.filter(Boolean)));
  if (unique.length === 0) return {};
  const { data, error } = await supabase.storage
    .from(COMMUNITY_BUCKET)
    .createSignedUrls(unique, 60 * 60 * 6);
  if (error || !data) return {};
  const map: Record<string, string> = {};
  data.forEach((row, i) => {
    const key = row.path ?? unique[i];
    if (key && row.signedUrl) map[key] = row.signedUrl;
  });
  return map;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "अभी";
  if (m < 60) return `${m} मिनट पहले`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} घंटे पहले`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} दिन पहले`;
  return new Date(iso).toLocaleDateString("hi-IN");
}

export function initials(name: string) {
  return name.trim().charAt(0) || "कि";
}

/** Makes sure a profile row exists for the signed-in user. */
export async function ensureProfile(userId: string, email?: string | null) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (data) return data as CommunityProfile;
  const fallback = email ? email.split("@")[0] : "किसान";
  const { data: created, error } = await supabase
    .from("profiles")
    .insert({ id: userId, display_name: fallback || "किसान" })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return created as CommunityProfile;
}

/** Avatars are stored as storage paths; swap them for temporary viewable URLs. */
export async function resolveAvatars(profiles: Record<string, CommunityProfile>) {
  const paths = Object.values(profiles)
    .map((p) => p.avatar_url)
    .filter((u): u is string => !!u && !u.startsWith("http"));
  if (!paths.length) return profiles;
  const map = await signImageUrls(paths);
  Object.values(profiles).forEach((p) => {
    if (p.avatar_url && map[p.avatar_url]) p.avatar_url = map[p.avatar_url]!;
  });
  return profiles;
}

export async function resolveAvatar(profile: CommunityProfile): Promise<CommunityProfile> {
  if (!profile.avatar_url || profile.avatar_url.startsWith("http")) return profile;
  const map = await signImageUrls([profile.avatar_url]);
  return { ...profile, avatar_url: map[profile.avatar_url] ?? null };
}
