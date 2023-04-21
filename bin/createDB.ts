import createDB from "../src/apiUtil/createDB";

(async () => {
  await createDB("cv.db", "./");
})();
