import { Character } from "@/store/useCharactersStore";

import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CheckboxValue } from "./ShowController";
type Props = {
  records: Character[];
  activeColumns: CheckboxValue;
};

export default function CVTable({ records, activeColumns }: Props) {
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
          {records.map((row) => (
            <StyledRow key={row.id}>
              <TableCell>{row.voiceActor}</TableCell>
              <CharaCell>{row.arknightsCharacterName ?? "-"}</CharaCell>
              <CharaCell>{row.blueArchiveCharacterName ?? "-"}</CharaCell>
              <CharaCell>{row.imasCynderellaName ?? "-"}</CharaCell>
            </StyledRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const CharaCell = styled(TableCell)`
  transition: 100ms;
  width: 25%;
  margin: 1px;
`;

const StyledHeaderRow = styled(TableRow)`
  background-color: #178de1;
  > .${tableCellClasses.head} {
    color: #fff;
    font-weight: bold;
  }
`;

const StyledRow = styled(TableRow)`
  background-color: #fff;
  &:nth-of-type(odd) {
    background-color: #e8f9ff;
  }
`;
