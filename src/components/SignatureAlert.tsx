import React from "react";
import { Alert, AlertTitle } from "@mui/material";
import { VerifiedUser } from "@mui/icons-material";
import { type SxProps } from "@mui/system";
import { type Theme } from "@mui/material/styles/createTheme";

// A note to calm concerns about signing a message.
export default function SignatureAlert({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Alert sx={sx} icon={<VerifiedUser />} color="gray" variant="standard">
      <AlertTitle>
        This gas-less signature is only used to prove ownership.
      </AlertTitle>
      It doesn&apos;t grant any authority to perform any transactions on your
      behalf.
    </Alert>
  );
}
