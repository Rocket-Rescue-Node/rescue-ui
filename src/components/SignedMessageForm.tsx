import { useState } from "react";
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
import { Error } from "@mui/icons-material";
import { type AccessCredential, useApi } from "../Api";
import OperatorInfoAlert from "./OperatorInfoAlert";

// A form for submitting the signed message JSON.
// If `readOnly` then the `initialValue` is not editable.
// If not `readOnly` then the value can be pasted or otherwise edited.
//
// The submit button will be disabled unless the signature is valid and the
// checkbox is checked to agree to the terms.
export default function SignedMessageForm({
  onCredentialCreated,
  initialValue = "",
  readOnly = false,
  operatorType = "solo",
  color = "primary",
}: {
  onCredentialCreated: (cred: AccessCredential) => void;
  initialValue?: string;
  readOnly?: boolean;
  operatorType?: "solo" | "rocketpool";
  color?: "primary" | "secondary";
}) {
  const [isAgreed, setAgreed] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<string>(initialValue);
  const { data: isValid } = useIsValidSignedMessage(value);
  const createCredentials = useApi.createCredentials({
    body: value,
    query: { operator_type: operatorType },
  });
  return (
    <Stack direction="column">
      <TextField
        multiline
        color={operatorType === "solo" ? "secondary" : "primary"}
        inputProps={{
          readOnly,
          spellCheck: false,
          sx: {
            fontFamily: "monospace",
            fontSize: 14,
            textWrap: "nowrap",
            wrap: "off",
            overflowX: "scroll",
          },
        }}
        InputProps={
          !value || isValid
            ? {}
            : {
                endAdornment: (
                  <InputAdornment position="end">
                    <Error color="error" />
                    Invalid
                  </InputAdornment>
                ),
              }
        }
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
      <OperatorInfoAlert value={value} operatorType={operatorType} />
      <FormControlLabel
        sx={{ mt: 1, mb: 1 }}
        control={
          <Checkbox
            color={color}
            value={isAgreed}
            onChange={(e, v) => {
              setAgreed(v);
            }}
          />
        }
        label={
          <>
            I agree to the{" "}
            <Link color={color} target="_blank" href="/docs/tandc.html">
              terms and conditions
            </Link>{" "}
            and acknowledge the{" "}
            <Link color={color} target="_blank" href="/docs/randt.html">
              associated risks
            </Link>
            .
          </>
        }
      />
      <Button
        color={color}
        disabled={!isValid || !isAgreed || createCredentials.isPending}
        endIcon={
          createCredentials.isPending ? <CircularProgress size={16} /> : null
        }
        onClick={async () => {
          // TODO: consider folding the .error/.data handling into the `Api` client.
          setError("");
          try {
            await createCredentials.mutateAsync(
              {
                body: value,
                query: { operator_type: operatorType },
              },
              {
                onSuccess: (data) => {
                  onCredentialCreated(data.data as AccessCredential);
                },
                onError: (error) => {
                  setError(String(error));
                },
              },
            );
          } catch (error) {
            setError(error as string);
          }
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
