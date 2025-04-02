import React from "react";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

export default function UserCard(): React.JSX.Element {
  return (
    <Tooltip title="Bears-2025">
      <Avatar alt="Cute Bear" src="cute.webp" />
    </Tooltip>
  );
}
