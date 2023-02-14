import { useCallback, useEffect } from "react";
import { atom, useAtom } from "jotai";

const localStorageAtom = atom<Record<string, unknown>>({});

export default function useClientSideLocalStorage<T>(
  key: string,
  defaultValue?: T
): [T | undefined, (v: T) => void] {
  const [storage, setStorage] = useAtom(localStorageAtom);

  const setValue = useCallback(
    (key: string, value: unknown) => {
      setStorage((prev) => ({ ...prev, [key]: value }));
    },
    [setStorage]
  );

  useEffect(() => {
    if (storage[key] === undefined) {
      const str = localStorage.getItem(key);
      if (str != null) {
        setValue(key, JSON.parse(str));
      } else if (defaultValue != null) {
        setValue(key, defaultValue);
        localStorage.setItem(key, JSON.stringify(defaultValue));
      } else {
        setValue(key, null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const dispatch = useCallback(
    (value: T) => {
      setValue(key, value);
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key, setValue]
  );

  return [storage[key] as T, dispatch];
}
