import React, { useState, useEffect } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import AddressChip from "./AddressChip";
import SignatureAlert from "./SignatureAlert";
import SignedMessageForm from "./SignedMessageForm";
import useValidateSignature from "../hooks/useValidateSignature";
import { type AccessCredential } from "../Api";

const Steps = {
  connectWallet: 0,
  signMessage: 1,
  submitSignedMessage: 2,
};

// Form for RP operators to request access.
// This uses a stepper to guide the process:
//  connect wallet -> sign message -> submit signature
export default function SoloNodeRequestAccess({
  onCredentialCreated,
}: {
  onCredentialCreated: (cred: AccessCredential) => void;
}) {
  const { disconnectAsync } = useDisconnect();
  const { isConnected, address } = useAccount();
  const { data: signature, signMessage } = useSignMessage();
  const [soloSignatureMessage, setSoloSignatureMessage] = useState("");
  const [isSignButtonClicked, setIsSignButtonClicked] = useState(false);

  const { data: validSignature } = useValidateSignature({
    message: soloSignatureMessage,
    signature,
    address,
  });

  // Update the message timestamp every second until the "Sign" button has been clicked.
  // This ensures the timestamp is fresh when they click "Sign", even if the user
  // leaves the tab open for a long time.
  useEffect(() => {
    if (isSignButtonClicked) return;

    const intervalId = setInterval(() => {
      setSoloSignatureMessage(`Rescue Node ${Math.floor(Date.now() / 1000)}`);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isSignButtonClicked]);

  // Decide which step we're on based on what we've gathered so far.
  const step =
    signature && validSignature
      ? Steps.submitSignedMessage
      : isConnected
        ? Steps.signMessage
        : Steps.connectWallet;
  return (
    <Stack direction="column">
      <Alert sx={{ mb: 2 }} severity="warning" color="gray">
        To avoid missing proposals make sure that{" "}
        <Link
          href="/docs/randt#fee-recipient-enforcement"
          color="inherit"
          target="_blank"
        >
          your fee-recipient is properly configured
        </Link>
        .
      </Alert>
      <Typography gutterBottom variant="body1">
        You’ll submit a signed message from your withdrawal wallet.
      </Typography>
      <SignatureAlert sx={{ mb: 1, mt: 1 }} />
      <Stepper
        activeStep={step}
        orientation="vertical"
        sx={{
          // Use the secondary ETH-y color for the step labels.
          "& .MuiStepLabel-root .Mui-completed": {
            color: "secondary.main",
          },
          "& .MuiStepLabel-root .Mui-active": {
            color: "secondary.main",
          },
        }}
      >
        {/*  First step, connect a wallet. */}
        <Step>
          <StepLabel
            optional={
              !isConnected || !address ? null : (
                <Stack direction="row" spacing={1}>
                  <AddressChip address={address} />
                  <Button
                    size={"small"}
                    color="inherit"
                    onClick={() => {
                      disconnectAsync().catch(() => {});
                    }}
                    endIcon={<Logout />}
                  >
                    Disconnect
                  </Button>
                </Stack>
              )
            }
          >
            <Typography
              variant={step === Steps.connectWallet ? "h5" : "subtitle1"}
              color="text.secondary"
            >
              {isConnected ? "Connected" : "Connect"} Wallet
            </Typography>
          </StepLabel>
          <StepContent>
            {!isConnected && (
              <>
                <Typography sx={{ mt: 2, mb: 3 }} gutterBottom>
                  Connect your wallet so you can be prompted to sign the
                  message.
                </Typography>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Connect your wallet using the browser extension or WalletConnect
                  </Typography>
                </Box>
                <Typography
                  sx={{ width: 190, mt: 1, ml: 1, mb: 0 }}
                  variant="caption"
                  color="text.secondary"
                  paragraph
                >
                  This wallet should be your validator withdrawal address.
                </Typography>
              </>
            )}
          </StepContent>
        </Step>

        {/*  Next step, prompt to sign the message. */}
        <Step>
          <StepLabel>
            <Typography
              variant={step === Steps.signMessage ? "h5" : "subtitle1"}
              color="text.secondary"
            >
              {signature ? "Signed" : "Sign"} Message
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography>
              Now you can sign the proof message with the connected wallet:
            </Typography>
            <Box sx={{ width: 300 }}>
              <TextField
                sx={{ width: 300 }}
                inputProps={{
                  sx: { fontFamily: "monospace" },
                }}
                fullWidth
                disabled
                value={soloSignatureMessage}
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => {
                  setIsSignButtonClicked(true);
                  signMessage({
                    message: soloSignatureMessage,
                  });
                }}
              >
                Sign
              </Button>
            </Box>
          </StepContent>
        </Step>

        {/*  Finally, submit the signed message. */}
        <Step>
          <StepLabel>
            <Typography
              variant={step === Steps.submitSignedMessage ? "h5" : "subtitle1"}
              color="text.secondary"
            >
              Submit Signed Message
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography>
              Now you can submit this signed message to request access.
            </Typography>
            <SignedMessageForm
              operatorType="solo"
              onCredentialCreated={onCredentialCreated}
              initialValue={JSON.stringify(
                {
                  address,
                  msg: soloSignatureMessage,
                  sig: signature,
                  version: "1",
                },
                null,
                4,
              )}
            />
          </StepContent>
        </Step>
      </Stepper>
    </Stack>
  );
}
