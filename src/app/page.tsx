import CVApp from "@/app/appContainer";
import getCVData from "@/app/getCVData";

export default async function CVTableContainer() {
  const records = await getCVData({
    arknights: false,
    bluearchive: false,
    imas_cinderella: false,
  });

  return <CVApp records={records} />;
}
