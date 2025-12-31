import { heroImages } from "@/config/hero";

export default function MusicVisualizer() {
  return (
    <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
      <img alt="Music Visualizer Background" className="object-contain" src={heroImages.ellipse} />
      <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`visualizer-bar bar-${i} w-[3px] bg-white/80`} />
        ))}
      </div>
    </div>
  );
}
