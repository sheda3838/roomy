"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import DashboardVisual from "./DashboardVisual";

export default function CinematicScroll() {
  // Track global page scroll instead of a tricky absolute container
  const { scrollYProgress } = useScroll();

  // Interpolations based on scroll progress:
  // 0.0 - 0.2 : Hero Section (Centered, large)
  // 0.3 - 0.5 : About Section (Scaled down, moved right)
  // 0.6 - 0.8 : How It Works (Moved left)
  // 0.9 - 1.0 : Previews / Bottom (Fading out / centered)

  const scale = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1], 
    [1.1, 1, 0.85, 0.8, 0.7, 0.6]
  );

  const x = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1], 
    ["0vw", "0vw", "25vw", "-25vw", "0vw", "0vw"]
  );

  const y = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1], 
    ["10vh", "10vh", "0vh", "10vh", "15vh", "15vh"]
  );

  const rotateY = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6], 
    [0, 0, -15, 15]
  );

  const rotateX = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6], 
    [5, 5, 0, 5]
  );

  const opacity = useTransform(scrollYProgress, 
    [0, 0.8, 0.95, 1], 
    [1, 1, 0, 0]
  );

  return (
    // This div needs to stretch the entire height of the scrollable sections 
    // It will be absolutely positioned in the parent `page.tsx`
    <div className="absolute inset-0 w-full z-0 pointer-events-none">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden" style={{ perspective: "1200px" }}>
        <motion.div 
          style={{ 
            scale, 
            x, 
            y, 
            rotateY, 
            rotateX,
            opacity 
          }} 
          className="pointer-events-auto origin-center"
        >
          <DashboardVisual />
        </motion.div>
      </div>
    </div>
  );
}
