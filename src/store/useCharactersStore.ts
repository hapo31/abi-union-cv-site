import { Response } from "@/apiUtil/createResponse";
import { CVEntity } from "@/entity/CVEntity";
import { GameType } from "@/pages/api/cv";
import useSWR from "swr";

export type Character = {
  id: number;
  voiceActor: string;
  voiceActorReading: string;
  blueArchiveCharacterName?: string;
  arknightsCharacterName?: string;
  imasCynderellaName?: string;
};

type Query = Record<GameType, boolean>;

export default function useCharactersStore(query: Query) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    () => validateQuery("CVDatabase", query),
    async ([key, query]) => {
      if (validateQuery(key, query) != null) {
        const res = await fetchCVDatabase(query);
        return res.payload.map<Character>((row) => ({
          id: row.id,
          voiceActor: row.cv_name,
          voiceActorReading: row.cv_name_read,
          arknightsCharacterName: row.arknights_chara,
          blueArchiveCharacterName: row.bluearchive_chara,
          imasCynderellaName: row.imas_cinderella_chara,
        }));
      }
      return undefined;
    }
  );

  return {
    data,
    error,
    isLoading: isLoading || isValidating,
    refetch: async () => {
      await mutate(undefined);
    },
  };
}

async function fetchCVDatabase(
  query: Record<GameType, boolean>
): Promise<Response<CVEntity[]>> {
  const res = await fetch(
    "/api/cv?" +
      new URLSearchParams({
        database: Object.entries(query)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(","),
      })
  );

  return await res.json();
}

function validateQuery(key: string, query?: Query): [string, Query] | null {
  return query == null ||
    !(query.arknights || query.bluearchive || query.imas_cinderella)
    ? null
    : [key, query];
}
