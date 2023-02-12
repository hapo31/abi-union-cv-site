import { Character } from "@/store/useCharactersStore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type Props = {
  records: Character[];
};

export default function CVTable({ records }: Props) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>声優名</TableCell>
            <TableCell>声優名(よみがな)</TableCell>
            <TableCell>アークナイツ</TableCell>
            <TableCell>ブルーアーカイブ</TableCell>
            <TableCell>アイドルマスター シンデレラガールズ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.voiceActor}</TableCell>
              <TableCell>{row.voiceActorReading}</TableCell>
              <TableCell>{row.arknightsCharacterName ?? "-"}</TableCell>
              <TableCell>{row.blueArchiveCharacterName ?? "-"}</TableCell>
              <TableCell>{row.imasCynderellaName ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
