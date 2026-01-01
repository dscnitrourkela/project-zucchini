"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface EventCategoryContextType {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
}

const EventCategoryContext = createContext<EventCategoryContextType | undefined>(undefined);

export const EVENT_CATEGORIES = [
  "Flagship Events",
  "Pro Shows",
  "Fun Events",
  "Main Events",
  "Workshops and Exhibition",
];

export function EventCategoryProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState("Flagship Events");

  return (
    <EventCategoryContext.Provider
      value={{
        activeCategory,
        setActiveCategory,
        categories: EVENT_CATEGORIES,
      }}
    >
      {children}
    </EventCategoryContext.Provider>
  );
}

export function useEventCategory() {
  const context = useContext(EventCategoryContext);
  if (context === undefined) {
    throw new Error("useEventCategory must be used within an EventCategoryProvider");
  }
  return context;
}
