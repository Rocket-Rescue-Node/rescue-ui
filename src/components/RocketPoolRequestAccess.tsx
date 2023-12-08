import React from "react";
import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import SignedMessageForm from "./SignedMessageForm";
import { type AccessCredential } from "../Api";

// This is the command RP operators run to get the signed message.
const rpSignatureCommand =
  'rocketpool node sign-message -m "Rescue Node `date +%s`"';

// Form for RP operators to request access.
export default function RocketPoolRequestAccess({
  onCredentialCreated,
}: {
  onCredentialCreated: (cred: AccessCredential) => void;
}) {
  return (
    <Stack direction="column">
      <Typography gutterBottom variant="body1">
        You’ll submit a signed message from your node.
      </Typography>
      {/* <SignatureAlert sx={{ mb: 1, mt: 1 }} /> */}
      <Typography sx={{ mt: 1 }} variant="body1">
        Run this command to sign the message
      </Typography>
      <TextField
        fullWidth
        // disabled
        variant="filled"
        value={rpSignatureCommand}
        inputProps={{
          readOnly: true,
          spellCheck: false,
          sx: {
            fontFamily: "monospace",
            fontSize: 14,
            pt: 2,
            pb: 2,
          },
        }}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <Button
                endIcon={<ContentCopy />}
                onClick={() => {
                  navigator.clipboard
                    .writeText(rpSignatureCommand)
                    .catch(() => {});
                }}
              >
                Copy
              </Button>
            </InputAdornment>
          ),
        }}
      />
      <Typography sx={{ mt: 3 }} variant="body1">
        and then paste the output here:
      </Typography>
      <SignedMessageForm
        operatorType="rocketpool"
        onCredentialCreated={onCredentialCreated}
      />
    </Stack>
  );
}
