import { Alert, IconButton } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

type Props = {
  message: string;
};

export default function ErrorAlert({ message }: Props) {
  return (
    <>
      <Alert sx={{ width: "100%", minWidth: "300px" }} severity="error">
        <p>以下のエラーが発生したようです。</p>
        <code>{message}</code>
        <div>
          <ReloadButton />
        </div>
      </Alert>
    </>
  );
}

function ReloadButton() {
  return (
    <IconButton
      color="primary"
      size="small"
      aria-label="reload"
      onClick={() => location.reload()}
    >
      <CachedIcon fontSize="small" />
      ページを再読み込み
    </IconButton>
  );
}
