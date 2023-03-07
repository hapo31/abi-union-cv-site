import { AppBar, Box, Card, Toolbar } from "@mui/material";
import ShowController, { CheckboxValue } from "@/components/ShowController";
import useClientSideLocalStorage from "@/hooks/useClientSideLocalStorage";
import CVTable from "@/components/CVTable";
import { GetStaticProps, NextConfig } from "next";
import createDB, { tablesExists } from "@/apiUtil/createDB";
import dotenv from "dotenv";
import fs from "fs/promises";
import getConfig from "next/config";
import path from "path";

type Props = {
  buildTime: number;
};

export default function App() {
  const [checkbox, dispatch] = useClientSideLocalStorage<CheckboxValue>(
    "checkbox",
    {}
  );
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>アークナイツ・ブルアカ・デレ共通の声優を調べるやつ</Toolbar>
      </AppBar>
      <Box position="sticky" top="0">
        <Card
          sx={{
            display: "flex",
            p: 1,
            backgroundColor: "#9ff",
            justifyContent: "center",
          }}
        >
          <ShowController onChange={dispatch} />
        </Card>
      </Box>
      <Box display="flex">
        <CVTable activeColumns={checkbox ?? {}} />
      </Box>
    </Box>
  );
}

export async function getStaticProps(): Promise<
  ReturnType<GetStaticProps<Props>>
> {
  const stage = process.env.STAGE;

  dotenv.config({
    path: stage ? `.env.${stage}` : ".env",
  });

  const { distDir }: NextConfig = getConfig();

  const dbName = process.env["SQLITE_DB_NAME"] ?? "cv.db";
  const outputDir = distDir ?? "./";

  const dbPath = path.resolve(dbName, outputDir);

  let exists = true;
  try {
    // DBファイルがなければ作る
    await fs.stat(dbPath);
    if (!(await tablesExists(dbPath))) {
      console.info(`${dbPath} was invalid, because table re-create`);
      await fs.rm(dbPath);
      exists = false;
    }
  } catch {
    exists = false;
  }
  if (!exists) {
    const outputPath = await createDB(dbName, outputDir);
    console.info(`Create db to ${outputPath} successful.`);
  }

  return {
    props: {
      buildTime: Date.now(),
    },
  };
}
