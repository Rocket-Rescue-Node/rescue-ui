import React, { useCallback, useState } from "react";
import useIsValidSignedMessage from "../hooks/useIsValidSignedMessage";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Error, Info } from "@mui/icons-material";
import { type AccessCredential, Api } from "../Api";
import { OperatorInfo, OperatorInfoSchema } from "./OperatorInfo";
import debounce from "lodash/debounce";

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
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<string>(initialValue);
  const { data: isValid } = useIsValidSignedMessage(value);
  const [opInfo, setOpInfo] = useState<OperatorInfo | null>(null);
  const setOperatorInfo = useCallback(
    debounce((msg: string) => {
      (async () => {
        setError("");
        try {
          const res = await Api.getOperatorInfo({
            body: msg,
            query: {
              operator_type: operatorType,
            },
          });
          // TODO: consider folding the .error/.data handling into the `Api` client.
          if (res.error) {
            setError(res.error as string);
          }
          if (!res.data) {
            console.log("missing .data and .error", res);
            setError("invalid response (missing .data and .error)");
          }
          if (OperatorInfoSchema.safeParse(res.data).success) {
            setOpInfo(res.data as OperatorInfo)
          } else {
            // Do we want to display this error in the same box as the cred errors? If not, move this to console.log or something.
            setError("error validating operator info");
          }
        } catch (err) {
          console.log("error", err);
          setError(err ? (err as string) : "Unknown error");
        }
      })().catch(() => {});
    }, 600),[]
  );
  const getOperatorInfo = () => {
    if (opInfo == null) {
      return null
    }

    // 86400 seconds = 1 day
    const windowInDays = opInfo.quotaSettings.window / 86400;
    const used = opInfo.credentialEvents.length;
    const remaining = opInfo.quotaSettings.count - opInfo.credentialEvents.length;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (opInfo.credentialEvents.length == 0) {
      return(`You have not used the Rescue Node in the past ${windowInDays} days.
        You have ${remaining} usages remaining.`
      );
    } else {
      // Multiplying by 1000 converts timestamp to milliseconds for working with Date()
      const nextTimestamp = (opInfo.credentialEvents[opInfo.credentialEvents.length - 1] * 1000) + (opInfo.quotaSettings.window * 1000) + 1000;
      const nextDate = new Date(nextTimestamp).toLocaleString('en-US', {timeZone: tz});
      const expiresTimestamp = (opInfo.credentialEvents[0] * 1000) + (opInfo.quotaSettings.authValidityWindow * 1000);
      const expiresDate = new Date(expiresTimestamp).toLocaleString('en-US', {timeZone: tz});

      if (expiresTimestamp > Date.now()) {
        return(`You have used the Rescue Node ${used} times in the past ${windowInDays} days.
          You have ${remaining} usages remaining. Your next increase will be at ${nextDate} (localized).
          You currently have an active credential, which will expire at ${expiresDate} (localized).`);
      }
      else {
        return(`You have used the Rescue Node ${used} times in the past ${windowInDays} days.
          You have ${remaining} usages remaining. Your next increase will be at ${nextDate} (localized).`);
      }
    }
  };
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
          setOperatorInfo(e.target.value);
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
      {/* Show operator info when available */}
      {opInfo ?
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center'  }} border={1} borderColor={'#808080'} borderRadius={0.75}>
          <Info sx={{ mx:2, verticalAlign: 'middle' }}/>
          <Typography sx={{ mr:2, my: 1, whiteSpace: 'pre-line' }} variant="body2">
            {getOperatorInfo()}
          </Typography>
        </Box> : null
      }
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
        disabled={!isValid || !isAgreed || isCreating}
        endIcon={isCreating ? <CircularProgress size={16} /> : null}
        onClick={() => {
          (async () => {
            setIsCreating(true);
            setError("");
            try {
              const res = await Api.createCredentials({
                body: value,
                query: {
                  operator_type: operatorType,
                },
              });
              // TODO: consider folding the .error/.data handling into the `Api` client.
              if (res.error) {
                setError(res.error as string);
              }
              if (!res.data) {
                console.log("missing .data and .error", res);
                setError("invalid response (missing .data and .error)");
              }
              onCredentialCreated(res.data as AccessCredential);
            } catch (err) {
              console.log("error", err);
              setError(err ? (err as string) : "Unknown error");
            } finally {
              setIsCreating(false);
            }
          })().catch(() => {});
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
