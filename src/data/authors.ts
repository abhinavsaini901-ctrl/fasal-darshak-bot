// Editorial team registry for E-E-A-T (Expertise, Experience, Authority, Trust)
// Used by article pages, AuthorBox component, and JSON-LD Person schema.

export type Author = {
  id: string;
  name: string;
  role: string;
  credentials: string; // degree / certification line
  bio: string; // 2-3 sentences in Hindi
  expertise: string[]; // domains they review/write
  experienceYears: number;
  location: string;
  initials: string; // for avatar fallback
  email?: string;
  links?: { label: string; url: string }[];
};

export const AUTHORS: Author[] = [
  {
    id: "dr-anil-kumar-verma",
    name: "डॉ. अनिल कुमार वर्मा",
    role: "मुख्य कृषि संपादक",
    credentials: "Ph.D. कृषि विज्ञान (Agronomy), G.B. पंत कृषि एवं प्रौद्योगिकी विश्वविद्यालय",
    bio: "डॉ. वर्मा को फसल उत्पादन, मृदा प्रबंधन और सिंचाई तकनीकों में 22 वर्षों का शोध अनुभव है। वे ICAR की कई परियोजनाओं से जुड़े रहे हैं और किसान मित्र की संपादकीय समीक्षा प्रक्रिया का नेतृत्व करते हैं।",
    expertise: ["गेहूं की खेती", "धान की खेती", "मृदा स्वास्थ्य", "उर्वरक प्रबंधन", "सिंचाई"],
    experienceYears: 22,
    location: "पंतनगर, उत्तराखंड",
    initials: "अकु",
    email: "editor@kisanlens.com",
  },
  {
    id: "dr-suman-patil",
    name: "डॉ. सुमन पाटिल",
    role: "वरिष्ठ पादप रोग विशेषज्ञ",
    credentials: "Ph.D. पादप रोगविज्ञान (Plant Pathology), महात्मा फुले कृषि विद्यापीठ, राहुरी",
    bio: "डॉ. पाटिल फसल रोग, कीट प्रबंधन और एकीकृत कीट प्रबंधन (IPM) पर 18 वर्षों से काम कर रही हैं। उन्होंने 40+ शोध पत्र प्रकाशित किए हैं और महाराष्ट्र के KVK नेटवर्क में सक्रिय हैं।",
    expertise: ["फसल रोग", "कीट नियंत्रण", "जैविक खेती", "टमाटर की खेती", "प्याज की खेती"],
    experienceYears: 18,
    location: "पुणे, महाराष्ट्र",
    initials: "सुप",
  },
  {
    id: "rajbir-singh-dhillon",
    name: "राजबीर सिंह ढिल्लों",
    role: "कृषि सलाहकार एवं किसान",
    credentials: "M.Sc. कृषि (PAU लुधियाना), प्रगतिशील किसान",
    bio: "राजबीर सिंह स्वयं 35 एकड़ में गेहूं, धान और सब्जियों की प्रगतिशील खेती करते हैं। वे 15 वर्षों से ड्रिप सिंचाई, संरक्षित खेती और मंडी रणनीति पर किसान कार्यशालाएँ संचालित करते हैं।",
    expertise: ["मंडी भाव", "ड्रिप सिंचाई", "गेहूं की खेती", "धान की खेती", "मौसम आधारित खेती"],
    experienceYears: 15,
    location: "लुधियाना, पंजाब",
    initials: "रसढ",
  },
  {
    id: "meena-yadav",
    name: "मीना यादव",
    role: "जैविक खेती एवं पशुपालन विशेषज्ञ",
    credentials: "M.Sc. बागवानी, प्रशिक्षित पशुपालन सलाहकार (NDDB)",
    bio: "मीना यादव जैविक खेती, वर्मीकम्पोस्ट, बागवानी और डेयरी पशुपालन पर लिखती हैं। वे राजस्थान और मध्य प्रदेश के 2000+ किसानों के साथ FPO सलाहकार के रूप में काम कर चुकी हैं।",
    expertise: ["जैविक खेती", "पशुपालन", "बागवानी", "उर्वरक प्रबंधन"],
    experienceYears: 12,
    location: "जयपुर, राजस्थान",
    initials: "मीय",
  },
  {
    id: "ashok-mishra",
    name: "अशोक मिश्रा",
    role: "कृषि नीति एवं योजना विश्लेषक",
    credentials: "M.A. ग्रामीण विकास, पूर्व ब्लॉक कृषि अधिकारी",
    bio: "अशोक मिश्रा सरकारी कृषि योजनाओं, MSP, फसल बीमा और सब्सिडी प्रक्रियाओं पर लिखते हैं। उन्होंने 10 वर्षों तक कृषि विभाग में काम किया और किसानों को योजनाओं से जोड़ा।",
    expertise: ["कृषि योजनाएं", "मंडी भाव"],
    experienceYears: 14,
    location: "लखनऊ, उत्तर प्रदेश",
    initials: "अमि",
  },
];

const BY_ID = new Map(AUTHORS.map((a) => [a.id, a]));
const BY_NAME = new Map(AUTHORS.map((a) => [a.name, a]));

export function getAuthorById(id: string): Author | undefined {
  return BY_ID.get(id);
}

export function getAuthorByName(name: string): Author | undefined {
  return BY_NAME.get(name);
}

// Pick an author based on article category — used when an article doesn't
// declare an explicit authorId.
export function pickAuthorForCategory(category: string): Author {
  const match = AUTHORS.find((a) => a.expertise.includes(category));
  return match ?? AUTHORS[0];
}
