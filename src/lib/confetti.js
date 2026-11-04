export async function fireConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.65 },
    colors: ["#4F46E5", "#FF6B4A", "#F8FAFC", "#22C55E"],
  });
}
