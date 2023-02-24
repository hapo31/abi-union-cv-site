import { readdir, stat } from "fs/promises";
import path from "path";

export async function outputDirTree(
  parent: string,
  ignoreDirs: string[] = ["node_modules", "etc", "usr", "dev"]
): Promise<Record<string, string[] | unknown>> {
  let dirs: string[];
  try {
    dirs = await readdir(parent);
  } catch {
    return { [parent]: "(permission_denied)" };
  }
  const fileStats = await Promise.all(
    dirs
      .filter(
        (dir) => !dir.startsWith(".") && (!ignoreDirs?.includes(dir) ?? true)
      )
      .map(async (file) => {
        try {
          return {
            file,
            stat: await stat(path.join(parent, file)),
          };
        } catch {
          return {
            file,
            stat: null,
          };
        }
      })
  );

  const result = await Promise.all(
    fileStats.map(async ({ file, stat }) => {
      if (stat == null || stat.isDirectory()) {
        return await outputDirTree(path.join(parent, file), ignoreDirs);
      } else {
        return file;
      }
    })
  );

  return { [parent]: result };
}
