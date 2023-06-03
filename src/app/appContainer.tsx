"use client";

import { Character } from "@/app/getCVData";
import { CVTableHead, CVTableBody } from "@/components/CVTable";
import ShowController from "@/components/ShowController";
import { CheckboxValue } from "@/hooks/useCheckboxQuery";
import useClientSideLocalStorage from "@/hooks/useClientSideLocalStorage";
import useSearchFilter from "@/store/useSearchFilterCharacter";
import { Card, TableContainer, Table } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo } from "react";

type Props = {
  records: Character[];
};

export default function CVApp({ records }: Props) {
  const [checkbox, dispatch] = useClientSideLocalStorage<CheckboxValue>(
    "checkbox",
    {}
  );

  const { search } = useSearchFilter();

  const filteredRecords = useMemo(
    () =>
      search == null
        ? records
        : records?.filter(
            ({
              arknightsCharacterName,
              arknightsCharacterNameReading,
              blueArchiveCharacterName,
              blueArchiveCharacterNameReading,
              imasCynderellaName,
              imasCynderellaNameReading,
              voiceActor,
              voiceActorReading,
            }) =>
              [
                arknightsCharacterName,
                arknightsCharacterNameReading,
                blueArchiveCharacterName,
                blueArchiveCharacterNameReading,
                imasCynderellaName,
                imasCynderellaNameReading,
                voiceActor,
                voiceActorReading,
              ].some((str) => str?.includes(search))
          ),
    [records, search]
  );

  return (
    <Box>
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
      <TableContainer>
        <Table>
          <CVTableHead activeColumns={checkbox ?? {}} />
          <CVTableBody records={filteredRecords} />
        </Table>
      </TableContainer>
    </Box>
  );
}
