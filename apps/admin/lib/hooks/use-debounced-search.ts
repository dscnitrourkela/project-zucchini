import { useState, useEffect, useCallback, useMemo, useRef } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export type SearchResult<T> = {
  results: T[];
  isSearching: boolean;
  isFromDatabase: boolean;
};

export function useDebouncedSearch<T extends Record<string, unknown>>({
  data,
  searchQuery,
  searchFields,
  debounceMs = 300,
  minQueryLength = 2,
  onDatabaseSearch,
}: {
  data: T[];
  searchQuery: string;
  searchFields: (keyof T)[];
  debounceMs?: number;
  minQueryLength?: number;
  onDatabaseSearch?: (query: string) => Promise<T[]>;
}): SearchResult<T> {
  const [isSearching, setIsSearching] = useState(false);
  const [dbResults, setDbResults] = useState<T[] | null>(null);
  const [isFromDatabase, setIsFromDatabase] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  // Memoize searchFields to prevent unnecessary re-renders
  const searchFieldsRef = useRef(searchFields);
  searchFieldsRef.current = searchFields;

  // Local search function - use ref to avoid dependency issues
  const searchLocal = useCallback((query: string, sourceData: T[]): T[] => {
    const lowerQuery = query.toLowerCase();
    return sourceData.filter((item) =>
      searchFieldsRef.current.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowerQuery);
        }
        return false;
      })
    );
  }, []);

  // Compute local results
  const localResults = useMemo(() => {
    if (debouncedQuery.length < minQueryLength) {
      return data;
    }
    return searchLocal(debouncedQuery, data);
  }, [debouncedQuery, data, minQueryLength, searchLocal]);

  // Handle database search when local search finds nothing
  useEffect(() => {
    // Reset when query is too short
    if (debouncedQuery.length < minQueryLength) {
      setDbResults(null);
      setIsFromDatabase(false);
      setIsSearching(false);
      return;
    }

    // If we found results locally, don't search database
    if (localResults.length > 0) {
      setDbResults(null);
      setIsFromDatabase(false);
      setIsSearching(false);
      return;
    }

    // No local results - search database if callback provided
    if (onDatabaseSearch) {
      setIsSearching(true);
      onDatabaseSearch(debouncedQuery)
        .then((results) => {
          setDbResults(results);
          setIsFromDatabase(true);
        })
        .catch((error) => {
          console.error("Database search failed:", error);
          setDbResults([]);
          setIsFromDatabase(true);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }
  }, [debouncedQuery, localResults.length, onDatabaseSearch, minQueryLength]);

  // Return database results if available, otherwise local results
  if (dbResults !== null && debouncedQuery.length >= minQueryLength) {
    return { results: dbResults, isSearching, isFromDatabase };
  }

  return {
    results: localResults,
    isSearching,
    isFromDatabase: false,
  };
}
