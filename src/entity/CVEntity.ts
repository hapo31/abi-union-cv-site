export type CVEntity = {
  arknights_id?: number;
  bluearchive_id?: number;
  imas_cinderella_id?: number;
  arknights_cv_name?: string;
  bluearchive_cv_name?: string;
  imas_cinderella_cv_name?: string;
  arknights_cv_name_read?: string;
  bluearchive_cv_name_read?: string;
  imas_cinderella_cv_name_read?: string;
  arknights_chara?: string;
  bluearchive_chara?: string;
  imas_cinderella_chara?: string;
  arknights_chara_read?: string;
  bluearchive_chara_read?: string;
  imas_cinderella_chara_read?: string;
};

export type CVTable = {
  id: number;
  cv_name: string;
  cv_name_read: string;
  chara: string;
  chara_read?: string;
};
