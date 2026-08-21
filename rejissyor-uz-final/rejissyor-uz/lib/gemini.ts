// lib/gemini.ts
// Wraps @google/genai and builds the "No-Repeat Story Engine" prompt.
// Every call is grounded in the genre, the full choice history, and a
// fresh per-session random seed so the model is steered away from its
// own most-likely (and therefore most-repeated) completions.

import { GoogleGenAI } from "@google/genai";
import { Genre } from "./types";
import type { GenerateSceneRequest, SceneResponse } from "./types";

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

function buildSystemInstruction(genre: Genre): string {
  return `Sen "Rejissyor.uz" ilovasining Interaktiv Kino Rejissyorisan (No-Repeat Story Engine).
Vazifang: "${genre.labelUz}" (${genre.labelEn}) janrida, foydalanuvchi bilan birgalikda, HECH QACHON takrorlanmaydigan interaktiv kino sahnalarini yaratish.

QATTIQ QOIDALAR:
1. Har bir sahna, har bir tanlov varianti va har bir vizual tavsif MUTLAQO NOYOB bo'lishi kerak — foydalanuvchiga yuborilgan oldingi sahnalar bilan (quyida "TARIX" sifatida beriladi) so'z, joy, obraz yoki syujet burilishi darajasida takrorlanmasligi kerak.
2. Foydalanuvchiga "session seed" beriladi — undan ijodiy tasodifiylik manbai sifatida foydalan, lekin uni matnda hech qachon ko'rsatma.
3. Matn o'zbek tilida, kinematografik, qisqa va kuchli bo'lsin (3-5 gap, ortiqcha cho'zmasdan).
4. Har doim aniq JSON formatida javob ber, boshqa hech qanday matn qo'shma (izoh, markdown belgilari, kod bloklari kerak emas).
5. optionA va optionB — bir-biridan tubdan farq qiluvchi, dramatik oqibatlari boshqacha bo'lgan ikkita tanlov bo'lishi kerak (bir xil natijaga olib boruvchi variantlar yaratma).
6. imagePrompt — ingliz tilida, kinematik, "cinematic film still, dramatic lighting, ${genre.labelEn} genre" uslubida, video/rasm generatsiya modeli uchun tayyor tasvir promti bo'lishi kerak.
7. Agar hikoya tabiiy ravishda tugash nuqtasiga yetgan bo'lsa (masalan, katarsis, o'lim, g'alaba, yakuniy pardaning tushishi), isEnding maydonini true qil va optionA/optionB o'rniga "Qayta boshlash" mazmunidagi yakuniy variantlarni ber.

JSON sxemasi (aniq shu maydonlar bilan):
{
  "sceneText": string,
  "imagePrompt": string,
  "optionA": string,
  "optionB": string,
  "isEnding": boolean
}`;
}

function buildUserPrompt(req: GenerateSceneRequest): string {
  const historyBlock =
    req.history.length === 0
      ? "(Hali tarix yo'q — bu hikoyaning boshlanishi.)"
      : req.history
          .map(
            (turn, i) =>
              `${i + 1}. SAHNA: ${turn.sceneText}\n   TANLOV: ${turn.choiceMade}`
          )
          .join("\n");

  const choiceBlock =
    req.lastChoice.trim().length > 0
      ? `Foydalanuvchining oxirgi tanlovi: "${req.lastChoice}"`
      : "Bu birinchi sahna — hikoyani yangi, jozibali voqea bilan boshla.";

  return `SESSION SEED: ${req.sessionSeed}

TARIX (avval yuborilgan barcha sahna va tanlovlar — bularni HECH QACHON takrorlama):
${historyBlock}

${choiceBlock}

Endi navbatdagi sahnani yoz. Yuqoridagi TARIX bilan mavzu, joy, personaj ismi yoki tasvir jihatidan bir xil bo'lmasligiga alohida e'tibor ber. Faqat JSON qaytar.`;
}

export async function generateScene(
  genre: Genre,
  req: GenerateSceneRequest
): Promise<SceneResponse> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: buildUserPrompt(req),
    config: {
      systemInstruction: buildSystemInstruction(genre),
      temperature: 1.1,
      topP: 0.97,
      responseMimeType: "application/json",
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Gemini API bo'sh javob qaytardi.");
  }

  let parsed: SceneResponse;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    // Model occasionally wraps JSON in fences despite instructions — strip and retry.
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  }

  if (
    typeof parsed.sceneText !== "string" ||
    typeof parsed.imagePrompt !== "string" ||
    typeof parsed.optionA !== "string" ||
    typeof parsed.optionB !== "string"
  ) {
    throw new Error("Gemini javobi kutilgan JSON strukturasiga mos kelmadi.");
  }

  return {
    sceneText: parsed.sceneText,
    imagePrompt: parsed.imagePrompt,
    optionA: parsed.optionA,
    optionB: parsed.optionB,
    isEnding: Boolean(parsed.isEnding),
  };
}
