import { FAQAccordionItemProps } from "@/config/faq";
import { cn } from "@/lib/utils";

export function FAQAccordionItem({ item, isExpanded, onClick, index }: FAQAccordionItemProps) {
  return (
    <div className="relative cursor-pointer rounded-tr-2xl rounded-bl-2xl" onClick={onClick}>
      <div
        className={cn(
          "relative w-full bg-white/10 border-2 border-white rounded-tr-2xl rounded-bl-2xl",
          "px-4 py-4 sm:px-5 sm:py-5 md:px-7 md:py-[22px]",
          "backdrop-blur-[14px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isExpanded && "py-6 sm:py-7 md:py-9"
        )}
      >
        <div className="flex items-start justify-between gap-2 md:gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <h3 className="text-white font-inria text-base sm:text-lg md:text-2xl font-bold">
              {item.question}
            </h3>
            <div
              className={cn(
                "grid transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
                isExpanded
                  ? "grid-rows-[1fr] opacity-100 mt-4 sm:mt-6 md:mt-8"
                  : "grid-rows-[0fr] opacity-0 mt-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="text-white font-inria text-sm sm:text-base md:text-xl">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 min-w-6 sm:min-w-7 md:min-w-8 relative">
            <div className="absolute w-4 sm:w-5 md:w-[22px] h-0.5 bg-white rounded-sm" />
            <div
              className={cn(
                "absolute w-0.5 h-4 sm:h-5 md:h-[22px] bg-white rounded-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                isExpanded ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
