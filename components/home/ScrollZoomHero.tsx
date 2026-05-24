"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollZoomHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress relative to this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scale the background image up massively so the "hole" in the center fills the screen
  const scale = useTransform(scrollYProgress, [0, 1], [1, 5]);
  
  // Transform the Y position of the text so it moves up and fades out
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-zinc-950">
      
      {/* Sticky container that holds the visual layout in place while scrolling */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        
        {/* Animated Background Image */}
        <motion.div 
          className="absolute inset-0 w-full h-full origin-[50%_65%]" // Origin set slightly lower if the arch hole is in the bottom center
          style={{ scale }}
        >
          {/* We use a high-res image and apply an overlay for text readability */}
          <img 
            src="/zoom-bg.png" 
            alt="Cinematic Landscape" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* Hero Text Overlay */}
        <motion.div 
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
          style={{ y: textY, opacity: textOpacity }}
        >
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[13px] font-bold tracking-wider uppercase">
            Compatibility Roommate Matching
          </div>
          
          <h1 className="font-sans font-bold tracking-tighter text-[50px] md:text-[70px] lg:text-[90px] leading-[0.95] text-white mb-6 drop-shadow-2xl">
            Close the rift <span className="text-[rgb(46,219,244)] font-medium">linking</span><br />
            <span className="text-[rgb(46,219,244)] font-medium">people and</span> places.
          </h1>

          <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            Shape scattered lifestyle signals into meaningful connections via lifestyle-based compatibility workflows.
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
          style={{ opacity: textOpacity }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll down</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>

      </div>
    </div>
  );
}
