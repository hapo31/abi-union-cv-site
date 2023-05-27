import { AppBar, Box, Card, Toolbar } from "@mui/material";
import ShowController, { CheckboxValue } from "@/components/ShowController";
import useClientSideLocalStorage from "@/hooks/useClientSideLocalStorage";
import CVTable from "@/components/CVTable";
import fetcher from "@/apiUtil/fetcher";
import { SWRConfig } from "swr";

type Props = {
  buildTime: number;
};

export default function App() {
  const [checkbox, dispatch] = useClientSideLocalStorage<CheckboxValue>(
    "checkbox",
    {}
  );
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        revalidateIfStale: false,
        refreshWhenHidden: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 3,
        // fallbackData: {},
      }}
    >
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
    </SWRConfig>
  );
}
