import { atom, useAtom } from "jotai";

const searchAtom = atom<string | null>(null);

export default function useSearchFilter() {
  const [search, setSearch] = useAtom(searchAtom);

  return { search, setSearch };
}
