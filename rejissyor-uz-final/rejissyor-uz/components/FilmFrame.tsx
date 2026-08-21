// components/FilmFrame.tsx
// Decorative cinema chrome: sprocket-hole rails down each edge and an
// ambient film-grain overlay. Purely presentational, no interaction.

export default function FilmFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sprocket-rail left" aria-hidden="true" />
      <div className="sprocket-rail right" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
      {children}
    </>
  );
}
