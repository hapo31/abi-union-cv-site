import { useCallback, useEffect, useState } from "react";

export default function useClientSideLocalStorage<T>(
  key: string,
  defaultValue?: T
): [T | undefined, (v: T) => void] {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    if (value == null) {
      const str = localStorage.getItem(key);
      if (str != null) {
        setValue(JSON.parse(str));
      } else if (defaultValue != null) {
        setValue(defaultValue);
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    }
  }, [defaultValue, key, value]);

  const dispatch = useCallback(
    (value: T) => {
      setValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  return [value, dispatch];
}
