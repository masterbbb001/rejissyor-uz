"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import FilmFrame from "@/components/FilmFrame";
import { getGenreById } from "@/lib/genres";
import type {
  GenerateSceneRequest,
  GenreId,
  SceneResponse,
  StoryTurn,
} from "@/lib/types";

function makeSessionSeed(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const CinemaCanvas = dynamic(() => import("@/components/three/CinemaCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen w-full items-center justify-center">
      <p className="animate-pulse font-display text-xs uppercase tracking-[0.35em] text-marquee">
        Kinozal qurilmoqda…
      </p>
    </div>
  ),
});

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<GenreId | null>(null);
  const [sessionSeed, setSessionSeed] = useState<string>("");
  const [history, setHistory] = useState<StoryTurn[]>([]);
  const [scene, setScene] = useState<SceneResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchScene = useCallback(
    async (genre: GenreId, seed: string, hist: StoryTurn[], lastChoice: string) => {
      setIsLoading(true);
      setErrorMessage(null);

      const body: GenerateSceneRequest = {
        genre,
        history: hist,
        lastChoice,
        sessionSeed: seed,
      };

      try {
        const res = await fetch("/api/generate-scene", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Noma'lum xatolik yuz berdi.");
        }

        setScene(data as SceneResponse);
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Sahnani yaratib bo'lmadi. Qayta urinib ko'ring."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  function handleSelectGenre(genreId: GenreId) {
    const seed = makeSessionSeed();
    setSelectedGenre(genreId);
    setSessionSeed(seed);
    setHistory([]);
    setScene(null);
    fetchScene(genreId, seed, [], "");
  }

  function handleChoose(choiceText: string) {
    if (!selectedGenre || !scene) return;

    const updatedHistory: StoryTurn[] = [
      ...history,
      { sceneText: scene.sceneText, choiceMade: choiceText },
    ];
    setHistory(updatedHistory);
    fetchScene(selectedGenre, sessionSeed, updatedHistory, choiceText);
  }

  function handleRestart() {
    setSelectedGenre(null);
    setSessionSeed("");
    setHistory([]);
    setScene(null);
    setErrorMessage(null);
  }

  const genre = selectedGenre ? getGenreById(selectedGenre) : undefined;

  return (
    <FilmFrame>
      <main className="relative h-screen w-full overflow-hidden">
        <CinemaCanvas
          genre={genre}
          scene={scene}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onSelectGenre={handleSelectGenre}
          onChoose={handleChoose}
          onRestart={handleRestart}
        />

        {/* Thin 2D nav overlay — meta controls that sit outside the story world */}
        {genre && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-between p-4 md:p-6">
            <button
              onClick={handleRestart}
              className="pointer-events-auto rounded-sm bg-void/50 px-3 py-2 font-display text-xs uppercase tracking-widest text-muted backdrop-blur transition-colors hover:text-marquee focus-visible:outline-2 focus-visible:outline-marquee"
            >
              ← Janrlarga qaytish
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-40 flex justify-center">
            <button
              onClick={() =>
                fetchScene(
                  selectedGenre!,
                  sessionSeed,
                  history,
                  history.length > 0
                    ? history[history.length - 1].choiceMade
                    : ""
                )
              }
              className="pointer-events-auto rounded-sm border border-marquee bg-void/70 px-6 py-2 font-display text-xs uppercase tracking-widest text-marquee-bright backdrop-blur transition-colors hover:bg-marquee/10 focus-visible:outline-2 focus-visible:outline-marquee"
            >
              Qayta urinish
            </button>
          </div>
        )}
      </main>
    </FilmFrame>
  );
}
