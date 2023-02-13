import useClientSideLocalStorage from "@/hooks/useClientSideLocalStorage";
import styled from "@emotion/styled";
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useForm } from "react-hook-form";
import { useDebounce } from "react-use";
import { useState } from "react";

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

export default function ShowController({ onChange: onChangeHandler }: Props) {
  const [values, dispatch] = useClientSideLocalStorage<CheckboxValue>(
    "checkbox",
    {}
  );

  const { register, getValues } = useForm<FormValues>({
    defaultValues: { ...values, search: "" },
  });
  const [formValues, setFormValues] = useState(getValues());

  useDebounce(
    () => {
      const val = formValues;
      dispatch(val);
      onChangeHandler(val);
      console.log(val);
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
            defaultChecked={values?.arknights}
            control={<Checkbox />}
            label="アークナイツ"
          />
          <FormControlLabel
            {...register("bluearchive")}
            defaultChecked={values?.bluearchive}
            control={<Checkbox />}
            label="ブルーアーカイブ"
          />
          <FormControlLabel
            {...register("imasCinderella")}
            defaultChecked={values?.imasCinderella}
            control={<Checkbox />}
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
            label="声優名、声優のよみがな、キャラ名、キャラの読み仮名..."
            variant="standard"
            sx={{ height: "40px" }}
          />
        </Box>
      </Form>
    </Wrap>
  );
}

const Wrap = styled(Card)`
  width: 100%;
`;

const Form = styled.form`
  user-select: none;
  background-color: #fff;
  width: 100%;
  padding: 2em;
`;
