// app/api/generate-scene/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateScene } from "@/lib/gemini";
import { getGenreById } from "@/lib/genres";
import type {
  ApiErrorResponse,
  GenerateSceneRequest,
  SceneResponse,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidHistory(history: unknown): history is GenerateSceneRequest["history"] {
  return (
    Array.isArray(history) &&
    history.every(
      (t) =>
        t &&
        typeof t === "object" &&
        typeof (t as any).sceneText === "string" &&
        typeof (t as any).choiceMade === "string"
    )
  );
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SceneResponse | ApiErrorResponse>> {
  let body: Partial<GenerateSceneRequest>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "So'rov tanasi noto'g'ri JSON formatida." },
      { status: 400 }
    );
  }

  const { genre, history, lastChoice, sessionSeed } = body;

  if (!genre || typeof genre !== "string") {
    return NextResponse.json(
      { error: "Janr (genre) ko'rsatilishi shart." },
      { status: 400 }
    );
  }

  const genreDef = getGenreById(genre);
  if (!genreDef) {
    return NextResponse.json(
      { error: `Noma'lum janr: ${genre}` },
      { status: 400 }
    );
  }

  if (!isValidHistory(history)) {
    return NextResponse.json(
      { error: "Tarix (history) massivi noto'g'ri formatda." },
      { status: 400 }
    );
  }

  if (typeof sessionSeed !== "string" || sessionSeed.length === 0) {
    return NextResponse.json(
      { error: "sessionSeed talab qilinadi." },
      { status: 400 }
    );
  }

  try {
    const scene = await generateScene(genreDef, {
      genre: genreDef.id,
      history,
      lastChoice: typeof lastChoice === "string" ? lastChoice : "",
      sessionSeed,
    });

    return NextResponse.json(scene, { status: 200 });
  } catch (err) {
    console.error("[generate-scene] Gemini error:", err);
    const message =
      err instanceof Error ? err.message : "Kutilmagan server xatosi.";

    const isConfigError = message.includes("GEMINI_API_KEY");

    return NextResponse.json(
      {
        error: isConfigError
          ? "Server sozlanmagan: GEMINI_API_KEY topilmadi."
          : "Sahnani yaratishda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.",
      },
      { status: isConfigError ? 500 : 502 }
    );
  }
}
