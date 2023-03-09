import { Response } from "@/apiUtil/createResponse";
import { CVEntity } from "@/entity/CVEntity";
import { GameType } from "@/pages/api/cv";
import useSWR from "swr";

export type Character = {
  id: string;
  voiceActor: string;
  voiceActorReading: string;
  blueArchiveCharacterName?: string;
  arknightsCharacterName?: string;
  imasCynderellaName?: string;
  blueArchiveCharacterNameReading?: string;
  arknightsCharacterNameReading?: string;
  imasCynderellaNameReading?: string;
};

type Query = Record<GameType, boolean>;

export default function useCharactersStore(query: Query) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["CVDatabase", query],
    async ([, query]) => {
      const res = await fetchCVDatabase(query);
      return res.payload.map<Character>((row) => ({
        id: `a${row.arknights_id}_b${row.bluearchive_id}_i${row.imas_cinderella_id}`,
        voiceActor: selectNonNull([
          row.arknights_cv_name,
          row.bluearchive_cv_name,
          row.imas_cinderella_cv_name,
        ]),
        voiceActorReading: selectNonNull([
          row.arknights_cv_name_read,
          row.bluearchive_cv_name_read,
          row.imas_cinderella_cv_name_read,
        ]),
        arknightsCharacterName: row.arknights_chara,
        blueArchiveCharacterName: row.bluearchive_chara,
        imasCynderellaName: row.imas_cinderella_chara,
        arknightsCharacterNameReading: row.arknights_chara_read,
        blueArchiveCharacterNameReading: row.bluearchive_chara_read,
        imasCynderellaNameReading: row.imas_cinderella_chara_read,
      }));
    },
    {
      keepPreviousData: true,
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
  const param = Object.entries(query)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(",");

  const res = await fetch(
    "/api/cv" +
      (param.length > 0
        ? "?" +
          new URLSearchParams({
            database: Object.entries(query)
              .filter(([_, value]) => value)
              .map(([key]) => key)
              .join(","),
          })
        : "")
  );

  return await res.json();
}

function selectNonNull(values: (string | undefined)[]): string {
  const r = values.filter((v) => v != null)[0];
  if (r == null) {
    throw new Error(`value is all null or undefined`);
  }

  return r;
}
