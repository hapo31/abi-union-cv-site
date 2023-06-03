import { GameType, getCV } from "@/api/cv";

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

export default async function getCVData(query: Query): Promise<Character[]> {
  const res = await getCV(
    Object.keys(query).filter((key) => query[key as GameType] == true)
  );
  return res.map(
    (row) =>
      ({
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
      } satisfies Character)
  );
}

function selectNonNull(values: (string | undefined)[]): string {
  const r = values.filter((v) => v != null)[0];
  if (r == null) {
    throw new Error(`value is all null or undefined`);
  }

  return r;
}
