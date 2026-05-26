"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FadeUp, StaggerReveal, StaggerItem } from "@/components/home/animations";

const FAQS = [
  {
    q: "How does the compatibility algorithm work?",
    a: "Roomy compares lifestyle and living preferences such as cleanliness, smoking, drinking, guest habits, budget, preferred locations, occupation, and sleep schedule to calculate a compatibility score. Instead of random listings, the platform helps users discover people and rooms that better fit their daily lifestyle and comfort.",
  },
  {
    q: "Can I post a room even if I'm already looking for a roommate?",
    a: "Absolutely. Roomy is designed to support both sides of the equation. Whether you have a spare room and need to find the right person to fill it, or you're actively searching for a place to move into, you can do both from the same account — simultaneously. Your room listing will be visible to people looking for places, while your profile stays discoverable to others who are also searching for a compatible flatmate. There's no need to choose one role or create multiple accounts.",
  },
  {
    q: "Is Roomy free to use?",
    a: "Yes. Roomy is currently a community-driven platform built to solve a real problem faced by the creator himself while searching for compatible roommates and living spaces. The goal is to help others avoid stressful roommate experiences by making compatibility and communication easier from the beginning.",
  },
  {
    q: "How do I start chatting with a match?",
    a: "You can send a join or connection request directly from a room or user profile. Once the other person accepts the request, a real-time chat becomes available instantly inside Roomy so both users can continue the conversation safely within the platform.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="rounded-2xl border border-zinc-100 bg-[rgb(243,244,237)]/60 px-6 py-5 cursor-pointer overflow-hidden"
      onClick={() => setOpen(!open)}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between font-semibold text-zinc-900 text-[15px]">
        <span>{q}</span>
        <motion.span
          className="ml-4 shrink-0 text-zinc-400 text-xl font-light"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        >
          +
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mt-4 text-zinc-500 leading-relaxed text-[15px]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 px-6 lg:px-16 bg-white">
      <div className="max-w-3xl mx-auto">

        <FadeUp delay={0}>
          <h2 className="font-serif text-3xl md:text-4xl text-zinc-900 text-center mb-12 tracking-tight">
            Frequently asked questions
          </h2>
        </FadeUp>

        <StaggerReveal className="space-y-4" stagger={0.09} delay={0.05}>
          {FAQS.map(({ q, a }) => (
            <StaggerItem key={q}>
              <FAQItem q={q} a={a} />
            </StaggerItem>
          ))}
        </StaggerReveal>

      </div>
    </section>
  );
}
