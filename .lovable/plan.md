# दैनिक कृषि न्यूज़ Web Push Notifications

रोज़ सुबह **6:00 बजे (IST)** यूज़र के मोबाइल/डेस्कटॉप पर browser push notification में टॉप 3 अखिल-भारतीय कृषि खबरें भेजी जाएँगी। कोई ऐप इंस्टॉल नहीं करना — सिर्फ़ वेबसाइट पर "Allow Notifications" दबाना है।

## क्या बनेगा

### 1. Frontend (PWA + Subscription UI)
- `public/manifest.webmanifest` और app icons (मौजूदा logo से) — ताकि "Add to Home Screen" काम करे
- `public/sw.js` — एक छोटा service worker जो push event पर notification दिखाएगा
- `src/components/NotificationOptIn.tsx` — होमपेज पर एक बेल आइकन वाला कार्ड: "रोज़ सुबह 6 बजे खबरें पाएँ" बटन
- बटन दबाने पर: notification permission माँगो → push subscription बनाओ → server पर save करो
- "अनसब्सक्राइब" बटन भी

### 2. Database (Lovable Cloud)
नई table `push_subscriptions`:
- `endpoint` (unique), `p256dh_key`, `auth_key`, `user_agent`, `created_at`
- कोई auth ज़रूरी नहीं — anonymous subscriptions allowed (RLS: सिर्फ़ service_role लिख/पढ़ सके)

### 3. Server Functions
- `subscribeToPush` — subscription save करता है
- `unsubscribeFromPush` — endpoint हटाता है

### 4. Public API Route (cron target)
- `src/routes/api/public/hooks/send-morning-push.ts`
- pg_cron रोज़ 00:30 UTC (= 6:00 IST) पर call करेगा
- सारी subscriptions लाएगा, टॉप 3 ताज़ा खबरें `getLiveAgriNews` से लेगा, हर subscription को VAPID-signed Web Push भेजेगा
- 410/404 response पर dead subscription auto-delete

### 5. VAPID Keys
- एक बार generate करके secrets में डालेंगे: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (mailto:contact@kisanlens.com)
- Public key client को `import.meta.env.VITE_VAPID_PUBLIC_KEY` से मिलेगी

### 6. pg_cron Job
```sql
SELECT cron.schedule(
  'morning-agri-push',
  '30 0 * * *',  -- 00:30 UTC = 06:00 IST
  $$ SELECT net.http_post(
    url:='https://project--8a0e629e-76fb-4e57-afa1-60231f26ed7e.lovable.app/api/public/hooks/send-morning-push',
    headers:='{"Content-Type":"application/json","apikey":"<anon>"}'::jsonb,
    body:='{}'::jsonb
  ); $$
);
```

## तकनीकी विवरण

- **Web Push library**: Cloudflare Worker पर पारंपरिक `web-push` npm package नहीं चलता (native crypto bindings)। हम pure-JS approach लेंगे — VAPID JWT खुद बनाएँगे (`SubtleCrypto` ES256) और हर subscription endpoint (FCM/Mozilla/Apple) पर सीधे `fetch` से POST करेंगे। Payload encryption (`aes128gcm`) भी SubtleCrypto से होगा।
- **iOS Safari**: web push सिर्फ़ "Add to Home Screen" करने के बाद ही काम करता है (iOS 16.4+) — यह UI में बताया जाएगा।
- **Lovable preview में service worker रजिस्टर नहीं होगा** (preview-safety guard) — सिर्फ़ published site पर।

## आपको क्या करना होगा

1. इस plan को approve करें
2. मैं VAPID keys generate करने का स्क्रिप्ट चलाऊँगा और फिर आपको 3 secrets add करने को बोलूँगा (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`)
3. बाक़ी सब अपने आप setup होगा

## सीमाएँ (पारदर्शिता)

- iPhone यूज़र को पहले "Add to Home Screen" करना होगा वरना push नहीं आएगा (Apple की पाबंदी)
- डेस्कटॉप पर browser बंद हो तो भी notification आती है, लेकिन मोबाइल Chrome/Edge में battery saver बंद रखना पड़ सकता है
- पहले 24 घंटे में delivery rate ~85–95% रहती है (normal Web Push average)
