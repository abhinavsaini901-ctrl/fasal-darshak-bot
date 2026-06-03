export type BlogCategory = {
  slug: string;
  name: string;
  description: string;
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: "gehu-ki-kheti", name: "गेहूं की खेती", description: "गेहूं की उन्नत किस्में, बीज, खाद और रोग प्रबंधन" },
  { slug: "dhan-ki-kheti", name: "धान की खेती", description: "धान की रोपाई से कटाई तक संपूर्ण मार्गदर्शन" },
  { slug: "sarso-ki-kheti", name: "सरसों की खेती", description: "सरसों उत्पादन और तेल फसलों की जानकारी" },
  { slug: "aalu-ki-kheti", name: "आलू की खेती", description: "आलू उत्पादन, भंडारण और बाज़ार" },
  { slug: "tamatar-ki-kheti", name: "टमाटर की खेती", description: "टमाटर उत्पादन और रोग नियंत्रण" },
  { slug: "pyaj-ki-kheti", name: "प्याज की खेती", description: "प्याज की खेती, भंडारण और मंडी" },
  { slug: "jaivik-kheti", name: "जैविक खेती", description: "जैविक खेती, प्रमाणन और बाजार" },
  { slug: "drip-sinchai", name: "ड्रिप सिंचाई", description: "ड्रिप, स्प्रिंकलर और जल प्रबंधन" },
  { slug: "fasal-rog", name: "फसल रोग", description: "फसलों की प्रमुख बीमारियां और इलाज" },
  { slug: "keet-niyantran", name: "कीट नियंत्रण", description: "कीट पहचान और प्रबंधन" },
  { slug: "krishi-yojanaye", name: "कृषि योजनाएं", description: "सरकारी योजनाएं और सब्सिडी" },
  { slug: "pashupalan", name: "पशुपालन", description: "डेयरी, बकरी और मुर्गी पालन" },
  { slug: "mandi-bhav", name: "मंडी भाव", description: "बाज़ार भाव और MSP" },
  { slug: "urvarak-prabandhan", name: "उर्वरक प्रबंधन", description: "NPK, सूक्ष्म पोषक तत्व" },
  { slug: "mausam-aadharit-kheti", name: "मौसम आधारित खेती", description: "मौसम के अनुसार फसल योजना" },
];

export function getCategoryByName(name: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.name === name);
}
