export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  expo: [0.16, 1, 0.3, 1],
};

export const duration = { instant: 0.1, fast: 0.15, base: 0.25, slow: 0.4, slower: 0.6 };

export const spring = {
  snappy: { type: "spring", stiffness: 500, damping: 30 },
  soft: { type: "spring", stiffness: 260, damping: 24 },
  bouncy: { type: "spring", stiffness: 600, damping: 15 },
};

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
  exit: { opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.inOut } },
};

export const pageVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.instant } },
  exit: { opacity: 0, transition: { duration: duration.instant } },
};

export const stepVariants = {
  enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: duration.base, ease: ease.out } },
  exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0, transition: { duration: duration.fast } }),
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
};

export const cardHover = {
  rest: { y: 0 },
  hover: { y: -4, transition: spring.soft },
};

export const tap = { scale: 0.97 };

export const seatVariants = {
  available: { scale: 1 },
  hover: { scale: 1.15, transition: spring.snappy },
  selected: { scale: [1, 1.25, 1], transition: { duration: 0.3, ease: ease.out } },
  rejected: { x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.35 } },
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: spring.soft },
  exit: { opacity: 0, scale: 0.98, transition: { duration: duration.fast } },
};
