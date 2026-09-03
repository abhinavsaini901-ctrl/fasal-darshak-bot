const PARTNER_URL = "https://www.sagarbiotech.com/";

/**
 * फसल में बीमारी मिलने पर Sagar Biotech के खाद/दवा की सिफारिश दिखाने वाला कार्ड।
 */
export function BiotechRecommendCard({
  lang = "hi",
  problem,
}: {
  lang?: string;
  problem?: string;
}) {
  const en = lang === "en";
  return (
    <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4">
      <p className="text-sm font-bold text-primary">
        {en ? "🌱 Recommended fertilizer / bio product" : "🌱 सुझाई गई खाद / बायो प्रोडक्ट"}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        {problem
          ? en
            ? `For "${problem}", along with the treatment above use a good bio-fertilizer so the plant recovers faster.`
            : `"${problem}" के लिए ऊपर बताए उपचार के साथ अच्छी बायो-खाद दें ताकि पौधा जल्दी ठीक हो।`
          : en
            ? "Along with the treatment above, use a good bio-fertilizer so the plant recovers faster."
            : "ऊपर बताए उपचार के साथ अच्छी बायो-खाद दें ताकि पौधा जल्दी ठीक हो।"}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {en
          ? "Sagar Biotech offers bio-fertilizers, micronutrients and plant-protection products for such crop problems."
          : "Sagar Biotech के पास ऐसी फसल समस्याओं के लिए बायो-खाद, सूक्ष्म पोषक तत्व और फसल सुरक्षा प्रोडक्ट उपलब्ध हैं।"}
      </p>
      <a
        href={PARTNER_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-3 inline-flex items-center justify-center rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
      >
        {en ? "View Sagar Biotech products" : "Sagar Biotech के प्रोडक्ट देखें"}
      </a>
      <p className="mt-2 text-[11px] text-muted-foreground">
        {en
          ? "Partner link. Always read the product label and confirm with your agriculture expert."
          : "पार्टनर लिंक। प्रोडक्ट लेबल ज़रूर पढ़ें और कृषि विशेषज्ञ से पुष्टि करें।"}
      </p>
    </div>
  );
}
