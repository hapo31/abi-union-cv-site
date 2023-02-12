import useClientSideLocalStorage from "@/hooks/useClientSideLocalStorage";
import styled from "@emotion/styled";
import { Card, Checkbox, FormControlLabel } from "@mui/material";
import { useForm } from "react-hook-form";

export type CheckboxValue = {
  arknights: boolean;
  bluearchive: boolean;
  imasCinderella: boolean;
};

type Props = {
  onChange: (e: CheckboxValue) => void;
};

export default function ShowControllCheckbox({
  onChange: onChangeHandler,
}: Props) {
  const [values, dispatch] = useClientSideLocalStorage<CheckboxValue>(
    "checkbox",
    undefined
  );

  const { register, getValues } = useForm<CheckboxValue>({
    defaultValues: values,
  });

  return (
    <Wrap>
      <form
        className="gameselector-form"
        onChange={() => {
          const values = getValues();
          dispatch(values);
          onChangeHandler(values);
        }}
      >
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
      </form>
    </Wrap>
  );
}

const Wrap = styled(Card)`
  width: 100%;
  .gameselector-form {
    user-select: none;
    background-color: #fff;
    width: 100%;
    padding: 2em;
    display: flex;
    justify-content: space-evenly;
  }
`;
