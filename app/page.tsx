export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/30 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-drift-slow pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative flex flex-col items-center">
        <span className="animate-rise text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Say hello to
        </span>
        <h1 className="animate-rise mt-3 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-7xl font-black tracking-tight text-transparent drop-shadow-sm sm:text-8xl [animation-delay:100ms]">
          Kipper
        </h1>
        <p className="animate-rise mt-6 max-w-md text-xl font-medium leading-snug text-foreground sm:text-2xl [animation-delay:200ms]">
          Your AI friend that finds fun things to do and helps you actually
          see your people.
        </p>
        <p className="animate-rise mt-4 max-w-sm text-lg font-semibold italic leading-snug text-accent [animation-delay:300ms]">
          Built for people who have an appetite for life.
        </p>

        <div className="animate-rise mt-10 flex items-center gap-3 [animation-delay:400ms]">
          <span className="h-px w-8 bg-foreground/30" />
          <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">
            Coming soon to San Francisco
          </p>
          <span className="h-px w-8 bg-foreground/30" />
        </div>
      </div>
    </div>
  );
}
