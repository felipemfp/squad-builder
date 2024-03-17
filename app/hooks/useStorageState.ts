import { useEffect, useRef, useState } from "react";

export function useStorageState<T>(key: string, defaultValue: T) {
  const state = useState(defaultValue);

  const [value, setValue] = state;

  const firstRenderRef = useRef(true);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue) as T;
      setValue(parsedValue);
    }
  }, [key, setValue]);

  useEffect(() => {
    if (!firstRenderRef.current) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    firstRenderRef.current = false;
  }, [key, value]);

  return state;
}
