import { motion } from 'framer-motion';

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -inset-y-6 -z-10 rounded-full opacity-70 blur-3xl lg:-inset-6"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 45%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 70%)',
        }}
      />

      <motion.img
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        src="/assets/hero-illustration-cropped.png"
        alt="Student browsing job opportunities on a laptop, with AI-matched roles and hiring companies shown alongside"
        className="w-full select-none"
        draggable={false}
      />
    </div>
  );
}
