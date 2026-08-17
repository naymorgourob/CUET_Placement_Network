export function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_65%_55%_at_20%_0%,black,transparent)]"
        style={{
          backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 55% at 12% 0%, color-mix(in srgb, var(--color-primary) 6%, transparent), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-background))' }}
      />
    </div>
  );
}
