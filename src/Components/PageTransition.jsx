import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import { pageVariants, pageVariantsReduced } from "@/lib/motion";

export default function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();
  const [settled, setSettled] = useState(Boolean(reduce));

  useEffect(() => {
    setSettled(Boolean(reduce));
  }, [location.pathname, reduce]);

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        className={settled ? "motion-settled" : undefined}
        variants={reduce ? pageVariantsReduced : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onAnimationComplete={() => setSettled(true)}
      >
        {outlet}
      </motion.main>
    </AnimatePresence>
  );
}
