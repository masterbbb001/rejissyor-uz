// lib/types.ts
// Shared types for Rejissyor.uz — the No-Repeat Story Engine.

export type GenreId =
  | "survival"
  | "cyberpunk"
  | "horror"
  | "scifi"
  | "detective"
  | "historical"
  | "post-apocalyptic"
  | "thriller";

export interface Genre {
  id: GenreId;
  labelUz: string;
  labelEn: string;
  tagline: string;
  accent: "gold" | "curtain";
}

// A single turn already taken in the story, sent back to the model
// so it never repeats itself.
export interface StoryTurn {
  sceneText: string;
  choiceMade: string;
}

// Request body for POST /api/generate-scene
export interface GenerateSceneRequest {
  genre: GenreId;
  history: StoryTurn[];
  // The choice that led to this new scene. Empty string on the very first call.
  lastChoice: string;
  // A per-session random seed the client generates once, used to steer
  // the model away from its own most-likely completions.
  sessionSeed: string;
}

// Shape returned by the model (and by the API route) for one scene.
export interface SceneResponse {
  sceneText: string;
  imagePrompt: string;
  optionA: string;
  optionB: string;
  isEnding: boolean;
}

export interface ApiErrorResponse {
  error: string;
}
