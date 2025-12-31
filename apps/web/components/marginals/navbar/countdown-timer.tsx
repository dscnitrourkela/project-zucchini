import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-02-07T00:00:00");
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-start gap-4 text-white font-berry">
      {[
        { val: timeLeft.days, label: "DAYS" },
        { val: ":", label: "" },
        { val: timeLeft.hours, label: "HOURS" },
        { val: ":", label: "" },
        { val: timeLeft.minutes, label: "MINUTES" },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <span className="text-2xl md:text-3xl leading-none">
            {typeof item.val === "number" ? item.val.toString().padStart(2, "0") : item.val}
          </span>
          {item.label && (
            <span className="text-[10px] md:text-xs mt-1 tracking-wider">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
