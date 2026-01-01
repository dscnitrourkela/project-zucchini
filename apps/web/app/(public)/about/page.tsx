"use client";

import { useState, useEffect } from "react";
import AboutCard from "../../../components/about/about-card";
import VideoCard from "../../../components/about/video-card";
import { SectionHeading } from "@/components/ui";
import ContactSection from "@/components/contact/contact";

const lengthConfigs = {
  aboveLLG: {
    aboutCard: {
      1: 150,
      2: 70,
    },
    videoCard: {
      1: 180,
      2: 250,
      3: 100,
    },
    breakpoint: 1140,
  },
  llg: {
    aboutCard: {
      1: 100,
      2: 50,
    },
    videoCard: {
      1: 150,
      2: 250,
      3: 350,
    },
    breakpoint: 1000,
  },
  lmd: {
    aboutCard: {
      1: 100,
      2: 50,
    },
    videoCard: {
      1: 150,
      2: 250,
      3: 300,
    },
    breakpoint: 470,
  },
};

function getLengthByScreenSize(width: number) {
  if (width >= lengthConfigs.aboveLLG.breakpoint) {
    return lengthConfigs.aboveLLG;
  } else if (width >= lengthConfigs.llg.breakpoint) {
    return lengthConfigs.llg;
  } else {
    return lengthConfigs.lmd;
  }
}

export default function AboutPage() {
  const [currentLength, setCurrentLength] = useState(() => {
    if (typeof window !== "undefined") {
      return getLengthByScreenSize(window.innerWidth);
    }
    return lengthConfigs.llg;
  });

  useEffect(() => {
    const handleResize = () => {
      const newLength = getLengthByScreenSize(window.innerWidth);
      setCurrentLength(newLength);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <main className="about-bg-image min-h-screen lmd:grid lmd:place-items-center pt-20">
        <div className="w-full pt-32 lmd:pt-0">
          <div className="max-w-full lmd:max-w-5xl llg:max-w-6xl mx-auto flex flex-col lmd:flex-row lmd:items-center justify-between lmd:gap-4 px-5">
            <div className="lmd:-skew-y-13 w-full flex justify-start lmd:block">
              <AboutCard length={currentLength.aboutCard} />
            </div>
            <div className="lmd:skew-y-13 my-20 lmd:my-0 w-full flex justify-end lmd:block lmd:w-full">
              <VideoCard length={currentLength.videoCard} />
            </div>
          </div>
        </div>
      </main>
      <main className="about-bg-image min-h-screen pb-32 pt-20">
        <div className="h-full max-w-7xl mx-auto px-10" id="contact">
          <SectionHeading title="Contact Us" containerClassName="mb-20" />
          <ContactSection />
        </div>
      </main>
    </>
  );
}
