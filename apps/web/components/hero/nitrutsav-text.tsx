"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const imgNitrutsavFilled = "/f1.svg";
const imgNitrutsavOutline = "/o1.svg";

interface NitrutsavTextProps {
  onAnimationComplete?: () => void;
}

export default function NitrutsavText({ onAnimationComplete }: NitrutsavTextProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-[1146px] aspect-[1146/303] rotate-[-1.5deg]">
        <motion.div
          className="absolute inset-0 z-20"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{
            duration: 4,
            ease: "easeInOut",
          }}
          onAnimationComplete={onAnimationComplete}
        >
          <Image
            src={imgNitrutsavFilled}
            alt="Nitrutsav Filled"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={imgNitrutsavOutline}
            alt="Nitrutsav Outline"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
