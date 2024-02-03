import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { type AccessCredential } from "../Api";
import moment from "moment";
import React, { useState } from "react";
import { ContentCopy } from "@mui/icons-material";
import { type SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles/createTheme";

export default function CredentialCard({
  cred,
  operatorType,
}: {
  cred?: AccessCredential;
  operatorType: "solo" | "rocketpool";
}) {
  return (
    <Card sx={{ width: 500 }} elevation={1}>
      <CardHeader
        title="Credential Acquired"
        subheader={
          cred ? `expires ${moment(cred.expiresAt * 1000).fromNow()}` : null
        }
      />
      <CardContent>
        <Stack direction="column" alignItems="center">
          <Box sx={{ width: 300 }}>
            <CopyTextField
              helperText={"Username"}
              value={cred?.username ?? ""}
            />
            <CopyTextField
              sx={{ mt: 1 }}
              helperText={"Password"}
              value={cred?.password ?? ""}
            />
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            If you lose this credential, you can re-request it without using
            additional quota (until the day before it expires).
          </Alert>
          <InstructionTabs
            sx={{ mt: 2, width: "100%" }}
            cred={cred}
            initialTab={operatorType}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function CopyTextField({
  sx,
  helperText,
  value,
  fontSize = 10,
}: {
  sx?: SxProps<Theme>;
  helperText: string;
  value: string;
  fontSize?: number;
}) {
  return (
    <TextField
      sx={sx}
      fullWidth
      variant="filled"
      value={value}
      multiline
      helperText={helperText}
      FormHelperTextProps={{ sx: { mt: 0 } }}
      inputProps={{
        readOnly: true,
        spellCheck: false,
        sx: {
          fontFamily: "monospace",
          fontSize,
          textWrap: "balance",
          wrap: "off",
          overflowX: "scroll",
          pr: 1,
          borderRight: "1pt ridge #888",
        },
      }}
      InputProps={{
        disableUnderline: true,
        sx: {
          pt: 1,
          pb: 1,
        },
        endAdornment: (
          <InputAdornment position="end">
            <Button
              endIcon={<ContentCopy />}
              onClick={() => {
                navigator.clipboard.writeText(value).catch(() => {});
              }}
            >
              Copy
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
}

function RocketPoolInstructions() {
  return (
    <Stack direction="column">
      <Typography gutterBottom>
        To enable Rescue Node, add this{" "}
        <Typography component={"span"} color="text.secondary">
          Username
        </Typography>{" "}
        and{" "}
        <Typography component={"span"} color="text.secondary">
          Password
        </Typography>{" "}
        to your Smartnode configuration:
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ textAlign: "center", fontFamily: "monospace" }}
        color="primary"
      >
        Categories
        <Typography variant="caption" sx={{ m: 1 }} color="text.secondary">
          &gt;
        </Typography>
        Addons
        <Typography variant="caption" sx={{ m: 1 }} color="text.secondary">
          &gt;
        </Typography>
        Rescue Node
      </Typography>
      <Typography sx={{ mt: 3 }}>
        For more complicated setups that don&apos;t use the Smartnode UI, you
        can{" "}
        <Link target="_blank" href="/docs/how-to-connect/rp">
          configure your rescue node credentials manually
        </Link>
        .
      </Typography>
    </Stack>
  );
}

function SoloInstructions() {
  return (
    <Stack direction="column">
      <Typography>
        To enable Rescue Node you will need this{" "}
        <Typography component={"span"} color="text.secondary">
          Username
        </Typography>{" "}
        and{" "}
        <Typography component={"span"} color="text.secondary">
          Password
        </Typography>{" "}
        to configure your access URL.
      </Typography>
      <Typography sx={{ mt: 3 }}>
        Follow this{" "}
        <Link target="_blank" href="/docs/how-to-connect/solo">
          guide to configuring rescue node as a Solo Staker
        </Link>
        .
      </Typography>
    </Stack>
  );
}
function InstructionTabs({
  sx,
  cred,
  initialTab = "rocketpool",
}: {
  sx?: SxProps<Theme>;
  cred?: AccessCredential | undefined;
  initialTab?: "rocketpool" | "solo";
}) {
  const [tab, setTab] = useState<"rocketpool" | "solo">(initialTab);
  return (
    <Stack direction="column" sx={sx} spacing={2}>
      <Tabs
        sx={{ width: "100%" }}
        value={tab}
        variant={"fullWidth"}
        textColor={tab === "rocketpool" ? "primary" : "secondary"}
        indicatorColor={tab === "rocketpool" ? "primary" : "secondary"}
        onChange={(e, v: "rocketpool" | "solo") => {
          setTab(v);
        }}
      >
        <Tab
          value="rocketpool"
          label={
            <Typography variant="inherit" color="primary">
              Rocket Pool Operator
            </Typography>
          }
        />
        <Tab
          value="solo"
          label={
            <Typography variant="inherit" color="secondary">
              Solo Node Operator
            </Typography>
          }
        />
      </Tabs>
      {tab === "rocketpool" ? <RocketPoolInstructions /> : <SoloInstructions />}
    </Stack>
  );
}
