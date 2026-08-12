"use client";

import { motion } from "framer-motion";

interface LifeOpsOrbProps {
  state?: "idle" | "thinking" | "needs-input" | "complete";
}

export function LifeOpsOrb({
  state = "idle",
}: LifeOpsOrbProps) {
  const isThinking = state === "thinking";
  const needsInput = state === "needs-input";

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <motion.div
        animate={{
          scale: isThinking
            ? [1, 1.08, 0.98, 1.04, 1]
            : needsInput
              ? [1, 1.06, 1]
              : [1, 1.025, 1],
        }}
        transition={{
          duration: isThinking ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute h-32 w-32 rounded-full bg-gradient-to-br from-zinc-800 via-zinc-500 to-zinc-200 blur-2xl opacity-25"
      />

      <motion.div
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative h-24 w-24 overflow-hidden rounded-full border border-white/50 bg-gradient-to-br from-zinc-900 via-zinc-500 to-zinc-100 shadow-[0_20px_70px_rgba(0,0,0,0.18)]"
      >
        <div className="absolute left-4 top-3 h-7 w-7 rounded-full bg-white/70 blur-md" />

        <div className="absolute bottom-1 right-1 h-12 w-12 rounded-full bg-white/20 blur-xl" />
      </motion.div>

      {isThinking && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute h-36 w-36 rounded-full border border-dashed border-zinc-300"
        />
      )}
    </div>
  );
}