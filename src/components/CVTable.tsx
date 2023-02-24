import useClientSideLocalStorage from "@/hooks/useClientSideLocalStorage";
import useCharactersStore, { Character } from "@/store/useCharactersStore";
import useSearchFilter from "@/store/useSearchFilterCharacter";

import {
  CircularProgress,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { CheckboxValue } from "./ShowController";
type Props = {
  activeColumns: CheckboxValue;
};

function CVTable({ activeColumns }: Props) {
  const [checkbox] = useClientSideLocalStorage<CheckboxValue>("checkbox", {});

  const { data: records, isLoading } = useCharactersStore({
    arknights: checkbox?.arknights ?? false,
    bluearchive: checkbox?.bluearchive ?? false,
    imas_cinderella: checkbox?.imasCinderella ?? false,
  });

  const { search } = useSearchFilter();

  const filteredRecords = useMemo(
    () =>
      search == null
        ? records
        : records?.filter((row) =>
            [
              row.arknightsCharacterName,
              row.arknightsCharacterNameReading,
              row.blueArchiveCharacterName,
              row.blueArchiveCharacterNameReading,
              row.imasCynderellaName,
              row.imasCynderellaNameReading,
              row.voiceActor,
              row.voiceActorReading,
            ].some((str) => str?.includes(search))
          ),
    [records, search]
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <StyledHeaderRow>
            <TableCell>声優名</TableCell>
            <CharaCell
              sx={{
                "&:after": {
                  display: "inline",
                  content: activeColumns?.arknights ? '"✔"' : '"  "',
                  ml: 1,
                },
              }}
            >
              アークナイツ
            </CharaCell>
            <CharaCell
              sx={{
                "&:after": {
                  display: "inline",
                  content: activeColumns?.bluearchive ? '"✔"' : '"  "',
                  ml: 1,
                },
              }}
            >
              ブルーアーカイブ
            </CharaCell>
            <CharaCell
              sx={{
                "&:after": {
                  display: "inline",
                  content: activeColumns?.imasCinderella ? '"✔"' : '"  "',
                  ml: 1,
                },
              }}
            >
              アイドルマスター シンデレラガールズ
            </CharaCell>
          </StyledHeaderRow>
        </TableHead>
        <TableBody>
          {filteredRecords == null || isLoading ? (
            <CircularProgress />
          ) : (
            filteredRecords.map((row) => (
              <StyledRow key={row.id}>
                <TableCell>{row.voiceActor}</TableCell>
                <CharaCell>{row.arknightsCharacterName ?? "-"}</CharaCell>
                <CharaCell>{row.blueArchiveCharacterName ?? "-"}</CharaCell>
                <CharaCell>{row.imasCynderellaName ?? "-"}</CharaCell>
              </StyledRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const CVTableDynamic = dynamic({
  loader: async () => CVTable,
  ssr: false,
});

export default CVTableDynamic;

const CharaCell = styled(TableCell)`
  transition: 100ms;
  width: 25%;
  padding: 5px;
`;

const StyledHeaderRow = styled(TableRow)`
  background-color: #178de1;
  > .${tableCellClasses.head} {
    color: #fff;
    font-weight: bold;
  }
`;

const StyledRow = styled(TableRow)`
  transition: 200ms;
  background-color: #fff;
  &:nth-of-type(odd) {
    background-color: #e8f9ff;
  }
  &:hover {
    background-color: #cfedf8;
  }
`;
