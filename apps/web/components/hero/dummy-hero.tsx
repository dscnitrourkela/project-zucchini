import { ladyImage, nuLogo } from "@/config/hero";
import Image from "next/image";

export default function DummyHero() {
  return (
    <main className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-grad px-10">
      <div className="relative flex items-center justify-center -top-15">
        <div className="absolute top-[30%] sm:top-[50%] left-1/2 -translate-x-1/2 w-[120%] sm:w-[85%] h-auto -z-0">
          <Image src={ladyImage} alt="lady" width={800} height={800} className="w-full h-auto" />
        </div>

        <Image
          src={nuLogo}
          alt="logo"
          width={900}
          height={900}
          className="relative z-10 w-full max-w-[850px] h-auto"
        />
      </div>
    </main>
  );
}
