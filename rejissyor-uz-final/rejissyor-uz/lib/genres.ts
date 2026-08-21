// lib/genres.ts
import { Genre } from "./types";

export const GENRES: Genre[] = [
  {
    id: "survival",
    labelUz: "Omon qolish",
    labelEn: "Survival",
    tagline: "Har bir tanlov — bir kunlik hayot",
    accent: "gold",
  },
  {
    id: "cyberpunk",
    labelUz: "Kiberpank",
    labelEn: "Cyberpunk",
    tagline: "Neon shahar, sun'iy ong, xotira savdosi",
    accent: "curtain",
  },
  {
    id: "horror",
    labelUz: "Qo'rqinchli",
    labelEn: "Horror",
    tagline: "Zulmatda hech narsa tasodifiy emas",
    accent: "curtain",
  },
  {
    id: "scifi",
    labelUz: "Fantastika",
    labelEn: "Sci-Fi",
    tagline: "Yulduzlar orasida yangi qoidalar",
    accent: "gold",
  },
  {
    id: "detective",
    labelUz: "Detektiv",
    labelEn: "Detective",
    tagline: "Har bir dalil — yangi yolg'on",
    accent: "gold",
  },
  {
    id: "historical",
    labelUz: "Tarixiy",
    labelEn: "Historical",
    tagline: "O'tmish sizning qo'lingizda qayta yoziladi",
    accent: "gold",
  },
  {
    id: "post-apocalyptic",
    labelUz: "Post-apokalipsis",
    labelEn: "Post-Apocalyptic",
    tagline: "Dunyo tugadi. Hikoya davom etadi",
    accent: "curtain",
  },
  {
    id: "thriller",
    labelUz: "Triller",
    labelEn: "Thriller",
    tagline: "Vaqt tugayapti, ishoning kimga?",
    accent: "curtain",
  },
];

export function getGenreById(id: string): Genre | undefined {
  return GENRES.find((g) => g.id === id);
}
