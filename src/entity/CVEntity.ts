import * as t from "io-ts";

export const CVEntitySchema = t.partial({
  arknights_id: t.number,
  bluearchive_id: t.number,
  imas_cinderella_id: t.number,
  arknights_cv_name: t.string,
  bluearchive_cv_name: t.string,
  imas_cinderella_cv_name: t.string,
  arknights_cv_name_read: t.string,
  bluearchive_cv_name_read: t.string,
  imas_cinderella_cv_name_read: t.string,
  arknights_chara: t.string,
  bluearchive_chara: t.string,
  imas_cinderella_chara: t.string,
  arknights_chara_read: t.string,
  bluearchive_chara_read: t.string,
  imas_cinderella_chara_read: t.string,
});

export type CVEntity = t.TypeOf<typeof CVEntitySchema>;
