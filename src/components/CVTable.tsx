import { Character } from "@/store/useCharactersStore";

import {
  styled,
  Table,
  TableBody,
  TableCell,
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
    <TableContainer sx={{ px: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>声優名</TableCell>
            <CharaCell
              active={!!activeColumns?.arknights}
              activeColor="#f8f8ad"
            >
              アークナイツ
            </CharaCell>
            <CharaCell
              active={!!activeColumns?.bluearchive}
              activeColor="#90caf9"
            >
              ブルーアーカイブ
            </CharaCell>
            <CharaCell
              active={!!activeColumns?.imasCinderella}
              activeColor="#f8c2df"
            >
              アイドルマスター シンデレラガールズ
            </CharaCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.voiceActor}</TableCell>
              <CharaCell
                active={!!activeColumns?.arknights}
                activeColor="#ffffe4"
              >
                {row.arknightsCharacterName ?? "-"}
              </CharaCell>
              <CharaCell
                active={!!activeColumns?.bluearchive}
                activeColor="#d1eaff"
              >
                {row.blueArchiveCharacterName ?? "-"}
              </CharaCell>
              <CharaCell
                active={!!activeColumns?.imasCinderella}
                activeColor="#fde4f1"
              >
                {row.imasCynderellaName ?? "-"}
              </CharaCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

type CellProps = {
  active: boolean;
  activeColor: string;
};

const CharaCell = styled(TableCell)`
  ${(props: CellProps) =>
    !props.active ? "" : `background-color: ${props.activeColor};`}

  transition: 100ms;
  width: 25%;
  margin: 1px;
`;
