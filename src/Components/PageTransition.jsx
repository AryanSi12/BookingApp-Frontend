import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import { pageVariants, pageVariantsReduced } from "@/lib/motion";

export default function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        variants={reduce ? pageVariantsReduced : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {outlet}
      </motion.main>
    </AnimatePresence>
  );
}
