"use client";

import { useState } from "react";
import { faqData } from "@/config/faq";
import { FAQAccordionItem } from "./accordian";
import { SectionHeading } from "../ui";

export default function FAQ() {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set([1]));

  const handleToggle = (index: number) => {
    setExpandedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex flex-col items-center w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-24 md:pt-32 lg:pt-40 pb-10 md:pb-16 lg:pb-10">
        <div className="max-7xl mx-auto w-full">
          <SectionHeading
            title="FAQ'S"
            containerClassName="mb-20"
            textClassName="text-2xl md:text-4xl"
          />
        </div>

        <div
          className="flex flex-col w-full"
          style={{
            maxWidth: "1280px",
            gap: "16px",
          }}
        >
          {faqData.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              index={index}
              isExpanded={expandedIndices.has(index)}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
