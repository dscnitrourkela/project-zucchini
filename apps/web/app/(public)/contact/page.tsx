"use client";

import { SectionHeading } from "@/components/ui";
import ContactSection from "../../../components/contact/contact";

export default function ContactPage() {
  return (
    <main className="about-bg-image">
      <div className="py-32 h-full max-w-7xl mx-auto px-10">
        <SectionHeading title="Contact Us" containerClassName="mb-20" />
        <ContactSection />
      </div>
    </main>
  );
}
