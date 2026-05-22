"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Found a 92% compatibility match.",
  "Quiet roommates near Colombo.",
  "Connection accepted.",
  "Room available near APIIT.",
  "Night owl roommates only?",
  "2 compatible roommates nearby.",
];

export default function TypingEffect() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const currentMessage = messages[messageIndex];
    
    if (isDeleting) {
      if (displayedText.length === 0) {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
        timeout = setTimeout(() => {}, 500); // Wait before typing next
      } else {
        timeout = setTimeout(() => {
          setDisplayedText(currentMessage.substring(0, displayedText.length - 1));
        }, 30); // Deleting speed
      }
    } else {
      if (displayedText.length === currentMessage.length) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 3000); // Wait before deleting
      } else {
        timeout = setTimeout(() => {
          setDisplayedText(currentMessage.substring(0, displayedText.length + 1));
        }, 60); // Typing speed
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, messageIndex]);

  return (
    <div className="flex items-center gap-[2px]">
      <span className="text-sm font-medium tracking-wide text-zinc-700">
        {displayedText}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        className="inline-block w-[2px] h-[14px] bg-[rgb(34,142,222)] -translate-y-[1px]"
      />
    </div>
  );
}
