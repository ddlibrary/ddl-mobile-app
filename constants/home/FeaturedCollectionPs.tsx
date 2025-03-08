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
    title: "زمونږ د موضوعګانو لټول",
    data: [
      { id: "1", name: "ریاضیات", file_name: "mathematics-icon", subject_id: "1064", type_id: null, level_id: null },
      // { id: "2", name: "SOCIAL SCIENCES", file_name: "social-sciences-icon", subject_id: "859", type_id: null, level_id: null },
      { id: "3", name: "د ځمکې پېژندنه", file_name: "earth-sciences-icon", subject_id: "3703", type_id: null, level_id: null },
      { id: "4", name: "د ژوند علوم", file_name: "life-sciences-icon", subject_id: "3739", type_id: null, level_id: null },
      { id: "5", name: "د ژبې ادبیات", file_name: "language-arts-icon", subject_id: "3730", type_id: null, level_id: null },
      { id: "6", name: "د کارونې علوم", file_name: "applied-sciences-icon", subject_id: "3662", type_id: null, level_id: null },
      { id: "7", name: "هنر او انسانی علوم", file_name: "arts-and-humanities-icon", subject_id: "3670", type_id: null, level_id: null },
      { id: "8", name: "تخنیکي او مسلکي تعلیمات", file_name: "career-and-technical-education-icon", subject_id: "3692", type_id: null, level_id: null },
      { id: "9", name: "ښوونه او روزنه", file_name: "education-icon", subject_id: "3710", type_id: null, level_id: null },
      // { id: "10", name: "HISTORY", file_name: "history-icon", subject_id: "3483", type_id: null, level_id: null },
      { id: "11", name: "کاروبار او اړیکې", file_name: "business-and-communication-icon", subject_id: "3684", type_id: null, level_id: null },
      { id: "12", name: "طبیعي علوم", file_name: "physical-sciences-icon", subject_id: "3757", type_id: null, level_id: null },
    ],
  },
  {
    title: "د ځانګړو سرچینو ټولګې",
    data: [
      { id: "13", name: "تازه سرچینې", file_name: "fiber-new", subject_id: null, type_id: null, level_id: null },
      { id: "14", name: "کتابونه", file_name: "book", subject_id: null, type_id: "1458", level_id: null },
      { id: "15", name: "مقالې", file_name: "newspaper", subject_id: null, type_id: "3829", level_id: null },
      { id: "16", name: "د ماشومانو ادبیات", file_name: "child-care", subject_id: "3731", type_id: null, level_id: null },
      { id: "17", name: "ښوونه او روزنه", file_name: "local-library", subject_id: "3710", type_id: null, level_id: null },
      // { id: "18", name: "Higher Education", file_name: "school", subject_id: null, type_id: null, level_id: "3546" },
      { id: "19", name: "غږیز او لیدنيز کلیپونه", file_name: "featured-video", subject_id: null, type_id: "3831", level_id: null },
    ],
  },
];
