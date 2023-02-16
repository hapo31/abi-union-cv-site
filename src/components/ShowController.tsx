import styled from "@emotion/styled";
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import { useDebounce, useLocalStorage } from "react-use";
import { useState } from "react";
import dynamic from "next/dynamic";
import useSearchFilter from "@/store/useSearchFilterCharacter";

export type CheckboxValue = {
  arknights?: boolean;
  bluearchive?: boolean;
  imasCinderella?: boolean;
};

type FormValues = CheckboxValue & {
  search: string;
};

type Props = {
  onChange: (e: CheckboxValue) => void;
};

function ShowController({ onChange: onChangeHandler }: Props) {
  const [values, dispatch] = useLocalStorage<CheckboxValue>("checkbox", {});

  const { register, getValues } = useForm<FormValues>({
    defaultValues: { ...values, search: "" },
  });
  const [formValues, setFormValues] = useState(getValues());

  const { setSearch } = useSearchFilter();

  useDebounce(
    () => {
      const val = formValues;
      dispatch({
        arknights: val.arknights,
        bluearchive: val.bluearchive,
        imasCinderella: val.imasCinderella,
      });
      setSearch(val.search);
      onChangeHandler(val);
    },
    200,
    [formValues]
  );

  return (
    <Wrap>
      <Form
        onChange={() => {
          setFormValues(getValues());
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <Box display="flex" justifyContent="space-evenly">
          <FormControlLabel
            {...register("arknights")}
            control={<Checkbox defaultChecked={values?.arknights} />}
            label="アークナイツ"
          />
          <FormControlLabel
            {...register("bluearchive")}
            control={<Checkbox defaultChecked={values?.bluearchive} />}
            label="ブルーアーカイブ"
          />
          <FormControlLabel
            {...register("imasCinderella")}
            control={<Checkbox defaultChecked={values?.imasCinderella} />}
            label="アイドルマスターシンデレラガールズ"
          />
        </Box>
        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          height="40px"
        >
          <Box aria-label="search" mt={3.5}>
            <SearchIcon color="disabled" />
          </Box>
          <TextField
            fullWidth
            {...register("search")}
            label="声優名、声優の読み仮名、キャラ名、キャラの読み仮名..."
            variant="standard"
            sx={{ height: "40px" }}
          />
        </Box>
      </Form>
    </Wrap>
  );
}

const ShowControllerDynamic = dynamic(
  {
    loader: async () => ShowController,
  },
  {
    ssr: false,
  }
);

export default ShowControllerDynamic;

const Wrap = styled(Card)`
  width: 100%;
`;

const Form = styled.form`
  user-select: none;
  background-color: #fff;
  width: 100%;
  padding: 2em;
`;
