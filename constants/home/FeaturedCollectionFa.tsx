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
    title: "جستجوی مطالب",
    data: [
      { id: "1", name: "ریاضیات", file_name: "mathematics-icon", subject_id: "1063", type_id: null, level_id: null },
      { id: "2", name: "علوم اجتماعی", file_name: "social-sciences-icon", subject_id: "1110", type_id: null, level_id: null },
      // { id: "3", name: "EARTH SCIENCES", file_name: "earth-sciences-icon", subject_id: "1380", type_id: null, level_id: null },
      { id: "4", name: "علوم زیستی", file_name: "life-sciences-icon", subject_id: "1432", type_id: null, level_id: null },
      { id: "5", name: "ادبیات زبان", file_name: "language-arts-icon", subject_id: "2179", type_id: null, level_id: null },
      { id: "6", name: "علوم کاربردی", file_name: "applied-sciences-icon", subject_id: "3554", type_id: null, level_id: null },
      { id: "7", name: "هنر (آرت) و علوم انسانی", file_name: "arts-and-humanities-icon", subject_id: "3559", type_id: null, level_id: null },
      { id: "8", name: "تعلیمات تخنیکی و مسلکی", file_name: "career-and-technical-education-icon", subject_id: "3578", type_id: null, level_id: null },
      // { id: "9", name: "EDUCATION", file_name: "education-icon", subject_id: "3474", type_id: null, level_id: null },
      // { id: "10", name: "HISTORY", file_name: "history-icon", subject_id: "3483", type_id: null, level_id: null },
      { id: "11", name: "تجارت و ارتباطات", file_name: "business-and-communication-icon", subject_id: "3570", type_id: null, level_id: null },
      // { id: "12", name: "PHYSICAL SCIENCES", file_name: "physical-sciences-icon", subject_id: "3511", type_id: null, level_id: null },
    ],
  },
  {
    title: "مجموعه های منابع ویژه",
    data: [
      { id: "13", name: "آخرین منابع", file_name: "fiber-new", subject_id: null, type_id: null, level_id: null },
      { id: "14", name: "کتاب", file_name: "book", subject_id: null, type_id: "1457", level_id: null },
      { id: "15", name: "مقالات", file_name: "newspaper", subject_id: null, type_id: "2043", level_id: null },
      { id: "16", name: "ادبیات کودکان", file_name: "child-care", subject_id: "999", type_id: null, level_id: null },
      { id: "17", name: "تعلیم و تربیه", file_name: "local-library", subject_id: "4557", type_id: null, level_id: null },
      // { id: "18", name: "Higher Education", file_name: "school", subject_id: null, type_id: null, level_id: "3546" },
      { id: "19", name: "صدا و تصویر کلیپ ها", file_name: "featured-video", subject_id: null, type_id: "2045", level_id: null },
    ],
  },
];
