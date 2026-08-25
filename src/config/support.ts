import upiQrPlaceholder from "@/assets/upi-qr-placeholder.png";

/**
 * Kisan Lens Support (donation) settings.
 * इन values को बदलकर QR image और UPI ID अपडेट कर सकते हैं।
 *
 * QR बदलने के लिए: अपनी QR image `src/assets/` में रखें और नीचे import बदल दें।
 */
export const SUPPORT_CONFIG = {
  /** Public UPI ID (यहाँ अपनी UPI ID लिखें) */
  upiId: "8607581241@ptaxis",
  /** Payee name जो UPI app में दिखेगा */
  payeeName: "Kisan Lens",
  /** Suggested (optional) support amount in INR */
  suggestedAmount: 200,
  /** QR image — अपनी UPI QR image से replace करें */
  qrImage: upiQrPlaceholder,
  /** true रखें जब तक असली QR image अपलोड न हो */
  qrIsPlaceholder: true,
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
