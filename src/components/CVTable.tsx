import {
  styled,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
} from "@mui/material";

import { CheckboxValue } from "./ShowController";
import { Character } from "@/app/getCVData";

type HeadProps = {
  activeColumns: CheckboxValue;
};

export function CVTableHead({ activeColumns }: HeadProps) {
  return (
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
  );
}

type BodyProps = {
  records: Character[];
};

export function CVTableBody({ records }: BodyProps) {
  return (
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
  );
}

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
