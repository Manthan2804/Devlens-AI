"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  TextEffect — a small motion-primitives-style component for         */
/*  per-character / per-word / per-line staggered text reveals.        */
/*                                                                      */
/*  Usage:                                                              */
/*    <TextEffect per="char" preset="fade">Some text</TextEffect>       */
/*    <TextEffect per="word" as="h3" preset="blur">Some text</TextEffect>*/
/* ------------------------------------------------------------------ */

const defaultStaggerTimes = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const presetVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(10px)" },
  },
  "blur-slide": {
    hidden: { opacity: 0, filter: "blur(10px)", y: 12 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: { opacity: 0, filter: "blur(10px)", y: -12 },
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  },
};

function splitText(text, per) {
  if (per === "line") return text.split("\n");
  if (per === "word") return text.split(/(\s+)/).filter((s) => s.length > 0);
  return Array.from(text); // per === "char"
}

export function TextEffect({
  children,
  per = "word",
  as = "p",
  preset = "fade",
  className = "",
  style,
  delay = 0,
  speedReveal = 1,
  trigger = true,
  once = true,
  variants,
  segmentWrapperClassName = "",
  containerTransition,
  onAnimationComplete,
}) {
  const text = typeof children === "string" ? children : "";
  const segments = splitText(text, per);
  const chosenPreset = presetVariants[preset] || presetVariants.fade;
  const itemVariants = variants || chosenPreset;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: (defaultStaggerTimes[per] || 0.03) / speedReveal,
        delayChildren: delay,
        ...containerTransition,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: (defaultStaggerTimes[per] || 0.03) / speedReveal,
        staggerDirection: -1,
      },
    },
  };

  const MotionTag = motion[as] || motion.p;

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          initial="hidden"
          whileInView={once ? "visible" : undefined}
          animate={once ? undefined : "visible"}
          viewport={once ? { once: true, margin: "-10%" } : undefined}
          exit="exit"
          variants={container}
          className={className}
          style={style}
          onAnimationComplete={onAnimationComplete}
        >
          {segments.map((segment, i) => (
            <motion.span
              key={`${per}-${i}-${segment}`}
              variants={itemVariants}
              className={`inline-block whitespace-pre ${segmentWrapperClassName}`}
              style={per === "line" ? { display: "block" } : undefined}
            >
              {segment}
            </motion.span>
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}

export default TextEffect;