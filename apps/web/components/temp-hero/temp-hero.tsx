"use client";

import { useRef } from "react";
import { useParallax } from "./hooks";
import {
  BackgroundLayer,
  PeacockLeftLayer,
  OwlRightDecorationLayer,
  GirlLayer,
  LogoLayer,
  GradientOverlay,
  PeacockRightLayer,
  Parrot,
} from "./layers";
import FireworksEffect from "@/components/coming-soon/fireworks-effects";
import { LightStrings } from "./components";

export default function TempHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mouse, scrollY } = useParallax(containerRef);

  return (
    <main
      ref={containerRef}
      className="min-h-screen w-full overflow-hidden relative 2xl:max-h-[56.25vw] 2xl:min-h-[56.25vw]"
    >
      <FireworksEffect />

      <BackgroundLayer mouse={mouse} scrollY={scrollY} />

      <PeacockLeftLayer mouse={mouse} scrollY={scrollY} />
      <PeacockRightLayer mouse={mouse} scrollY={scrollY} />
      <Parrot mouse={mouse} scrollY={scrollY} />
      <OwlRightDecorationLayer mouse={mouse} scrollY={scrollY} />

      {/* <PeacockBehindLayer mouse={mouse} scrollY={scrollY} /> */}

      <LogoLayer mouse={mouse} scrollY={scrollY}>
        <LightStrings />
      </LogoLayer>

      <GirlLayer mouse={mouse} scrollY={scrollY} />

      <GradientOverlay />
    </main>
  );
}
