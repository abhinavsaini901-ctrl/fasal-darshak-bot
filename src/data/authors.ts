// Neutral site byline used until verified contributor information is supplied.

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

export const AUTHORS: Author[] = [{
  id: "kisan-lens-editorial",
  name: "Kisan Lens संपादकीय",
  role: "वेबसाइट सामग्री",
  credentials: "",
  bio: "यह लेख Kisan Lens वेबसाइट पर प्रकाशित सामान्य कृषि जानकारी है। इसे व्यक्तिगत खेत की परिस्थिति के अनुसार विशेषज्ञ सलाह न मानें।",
  expertise: [],
  experienceYears: 0,
  location: "",
  initials: "KL",
  email: "info@kisanlens.com",
}];

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
