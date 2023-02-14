import { Box, Popover } from "@mui/material";
import { PropsWithChildren, ReactNode, useState } from "react";

type Props = PropsWithChildren<{
  position?: "top" | "bottom";
  content: ReactNode;
}>;

export default function HoverPopover({
  position = "bottom",
  children,
  content,
}: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const popoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const popoverClose = () => {
    setAnchor(null);
  };
  return (
    <>
      <div
        className="HoverPopover-anchor"
        onMouseOver={popoverOpen}
        onMouseLeave={popoverClose}
      >
        {children}
      </div>
      <Popover
        open={anchor != null}
        sx={{ pointerEvents: "none" }}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: position,
          horizontal: "center",
        }}
      >
        <Box padding="5px">{content}</Box>
      </Popover>
    </>
  );
}
