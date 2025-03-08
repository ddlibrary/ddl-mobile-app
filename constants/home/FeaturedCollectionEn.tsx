import {IconSourceKeys} from "@/components/FeaturedCollectionIcons";

export type CardItem = {
  id: string;
  name: string;
  file_name: IconSourceKeys;
  subject_id: string | null;
  type_id: string | null;
  level_id: string | null;
};

export interface Section {
  title: string;
  data: CardItem[];
}


export const DATA: Section[] = [
  {
    title: "Explore our subjects",
    data: [
      { id: "1", name: "MATHEMATICS", file_name: "mathematics-icon", subject_id: "852", type_id: null, level_id: null },
      { id: "2", name: "SOCIAL SCIENCES", file_name: "social-sciences-icon", subject_id: "859", type_id: null, level_id: null },
      { id: "3", name: "EARTH SCIENCES", file_name: "earth-sciences-icon", subject_id: "1380", type_id: null, level_id: null },
      { id: "4", name: "LIFE SCIENCES", file_name: "life-sciences-icon", subject_id: "1429", type_id: null, level_id: null },
      { id: "5", name: "LANGUAGE ARTS", file_name: "language-arts-icon", subject_id: "2178", type_id: null, level_id: null },
      { id: "6", name: "APPLIED SCIENCES", file_name: "applied-sciences-icon", subject_id: "3440", type_id: null, level_id: null },
      { id: "7", name: "ARTS AND HUMANITIES", file_name: "arts-and-humanities-icon", subject_id: "3441", type_id: null, level_id: null },
      { id: "8", name: "CAREER AND TECHNICAL EDUCATION", file_name: "career-and-technical-education-icon", subject_id: "3459", type_id: null, level_id: null },
      { id: "9", name: "EDUCATION", file_name: "education-icon", subject_id: "3474", type_id: null, level_id: null },
      { id: "10", name: "HISTORY", file_name: "history-icon", subject_id: "3483", type_id: null, level_id: null },
      { id: "11", name: "BUSINESS AND COMMUNICATION", file_name: "business-and-communication-icon", subject_id: "3442", type_id: null, level_id: null },
      { id: "12", name: "PHYSICAL SCIENCES", file_name: "physical-sciences-icon", subject_id: "3511", type_id: null, level_id: null },
    ],
  },
  {
    title: "Featured resource collections",
    data: [
      { id: "13", name: "Latest Resources", file_name: "fiber-new", subject_id: null, type_id: null, level_id: null },
      { id: "14", name: "Books", file_name: "book", subject_id: null, type_id: "1456", level_id: null },
      { id: "15", name: "Articles", file_name: "newspaper", subject_id: null, type_id: "1305", level_id: null },
      { id: "16", name: "Children's Reading", file_name: "child-care", subject_id: "947", type_id: null, level_id: null },
      { id: "17", name: "Education", file_name: "local-library", subject_id: "3474", type_id: null, level_id: null },
      { id: "18", name: "Higher Education", file_name: "school", subject_id: null, type_id: null, level_id: "3546" },
      { id: "19", name: "Video and Audio Clips", file_name: "featured-video", subject_id: null, type_id: "837", level_id: null },
    ],
  },
];
