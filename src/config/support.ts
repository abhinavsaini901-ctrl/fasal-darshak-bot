import upiQrAsset from "@/assets/upi-qr-code.jpg.asset.json";

/**
 * Kisan Lens Support (donation) settings.
 * इन values को बदलकर QR image और UPI ID अपडेट कर सकते हैं।
 */
export const SUPPORT_CONFIG = {
  /** Public UPI ID (यहाँ अपनी UPI ID लिखें) */
  upiId: "8607581241@ptaxis",
  /** Payee name जो UPI app में दिखेगा */
  payeeName: "Kisan Lens",
  /** Suggested (optional) support amount in INR */
  suggestedAmount: 200,
  /** QR image — CDN asset URL */
  qrImage: upiQrAsset.url,
  /** true = placeholder warning दिखेगा; false = असली QR */
  qrIsPlaceholder: false,
};

export function buildUpiLink({
  upiId,
  payeeName,
  amount,
}: {
  upiId: string;
  payeeName: string;
  amount: number;
}) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: "INR",
    tn: "Kisan Lens Support",
  });
  return `upi://pay?${params.toString()}`;
}
