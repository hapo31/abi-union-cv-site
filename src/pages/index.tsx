import { AppBar, Box, Button, Card, Toolbar } from "@mui/material";
import ShowControllCheckbox, {
  CheckboxValue,
} from "@/components/ShowControllCheckbox";
import useCharactersStore from "@/store/useCharactersStore";
import CircularProgress from "@mui/material/CircularProgress";
import useClientSideLocalStorage from "@/hooks/useClientSideLocalStorage";
import CVTable from "@/components/CVTable";

export default function App() {
  const [checkbox, dispatch] = useClientSideLocalStorage<CheckboxValue>(
    "checkbox",
    undefined
  );

  const { data, isLoading, refetch, error } = useCharactersStore({
    arknights: checkbox?.arknights ?? true,
    bluearchive: checkbox?.bluearchive ?? false,
    imas_cinderella: checkbox?.imasCinderella ?? false,
  });

  console.log(error);

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
            width: "100vw",
          }}
        >
          <ShowControllCheckbox
            onChange={(values) => {
              dispatch(values);
            }}
          />
        </Card>
      </Box>
      {isLoading || data == null ? (
        <CircularProgress />
      ) : error ? (
        <Box flex="vertical">
          <code style={{ backgroundColor: "#f99" }}>
            {JSON.stringify(error, null, "\t")}
          </code>
        </Box>
      ) : (
        <Box flex="vertical">
          <CVTable records={data} />
        </Box>
      )}
    </Box>
  );
}
