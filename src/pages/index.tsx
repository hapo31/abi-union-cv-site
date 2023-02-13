import { AppBar, Box, Button, Card, Toolbar } from "@mui/material";
import ShowController, { CheckboxValue } from "@/components/ShowController";
import useCharactersStore from "@/store/useCharactersStore";
import CircularProgress from "@mui/material/CircularProgress";
import useClientSideLocalStorage from "@/hooks/useClientSideLocalStorage";
import CVTable from "@/components/CVTable";

export default function App() {
  const [checkbox, dispatch] = useClientSideLocalStorage<CheckboxValue>(
    "checkbox",
    {}
  );

  const { data, isLoading, refetch, error } = useCharactersStore({
    arknights: checkbox?.arknights ?? false,
    bluearchive: checkbox?.bluearchive ?? false,
    imas_cinderella: checkbox?.imasCinderella ?? false,
  });

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>アークナイツ・ブルアカ・デレ共通の声優を調べるやつ</Toolbar>
      </AppBar>
      <Box>
        <Card
          sx={{
            display: "flex",
            p: 3,
            backgroundColor: "#9ff",
            justifyContent: "center",
          }}
        >
          <ShowController
            onChange={(values) => {
              dispatch(values);
            }}
          />
        </Card>
      </Box>
      <Box display="flex">
        {isLoading || data == null ? (
          <CircularProgress />
        ) : error ? (
          <code style={{ backgroundColor: "#f99" }}>
            {JSON.stringify(error, null, "\t")}
          </code>
        ) : (
          <CVTable activeColumns={checkbox ?? {}} records={data} />
        )}
      </Box>
    </Box>
  );
}
