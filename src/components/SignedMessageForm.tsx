import React, { useState } from "react";
import useIsValidSignedMessage from "../hooks/useIsValidSignedMessage";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { Error, HourglassEmpty } from "@mui/icons-material";
import { type AccessCredential, Api } from "../Api";

// A form for submitting the signed message JSON.
//
// The submit button will be disabled unless the signature is valid and the
// checkbox is checked to agree to the terms.
export default function SignedMessageForm({
  operatorType,
  onCredentialCreated,
  initialValue = "",
}: {
  operatorType: "solo" | "rocketpool";
  onCredentialCreated: (cred: AccessCredential) => void;
  initialValue?: string;
}) {
  const [isAgreed, setAgreed] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<string>(initialValue);
  const { data: isValid } = useIsValidSignedMessage(value);

  const inputProps = () => {
    if (value && isValid === undefined) {
      return {
        endAdornment: (
          <InputAdornment position="end">
            <HourglassEmpty color="secondary" />
            Verifying...
          </InputAdornment>
        ),
      };
    }

    if (value && !isValid) {
      return {
        endAdornment: (
          <InputAdornment position="end">
            <Error color="error" />
            Invalid
          </InputAdornment>
        ),
      };
    }

    return {};
  };

  return (
    <Stack direction="column">
      <TextField
        multiline
        color={operatorType === "solo" ? "secondary" : "primary"}
        inputProps={{
          readOnly: operatorType === "solo",
          spellCheck: false,
          sx: {
            fontFamily: "monospace",
            fontSize: 14,
            textWrap: "nowrap",
            wrap: "off",
            overflowX: "scroll",
          },
        }}
        InputProps={inputProps()}
        variant="outlined"
        rows={6}
        spellCheck={false}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={JSON.stringify(
          {
            address: "0x...",
            msg: "Rescue Node ...",
            sig: "0x...",
            version: "1",
          },
          null,
          4,
        )}
      />
      <FormControlLabel
        sx={{ mt: 1, mb: 1 }}
        control={
          <Checkbox
            color="primary"
            value={isAgreed}
            onChange={(e, v) => {
              setAgreed(v);
            }}
          />
        }
        label={
          <>
            I agree to the{" "}
            <Link color="primary" target="_blank" href="/docs/tandc.html">
              terms and conditions
            </Link>{" "}
            and acknowledge the{" "}
            <Link color="primary" target="_blank" href="/docs/randt.html">
              associated risks
            </Link>
            .
          </>
        }
      />
      <Button
        color="primary"
        disabled={!isValid || !isAgreed || isCreating}
        endIcon={isCreating ? <CircularProgress size={16} /> : null}
        onClick={() => {
          setIsCreating(true);
          setError("");
          void Api.createCredentials(
            {
              body: value,
              query: {
                operator_type: operatorType,
              },
            },
            onCredentialCreated,
            setError,
            () => {
              setIsCreating(false);
            },
          );
        }}
        variant="contained"
        size="large"
      >
        Request Access
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Stack>
  );
}
