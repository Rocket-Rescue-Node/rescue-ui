import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { AccessCredential } from "../Api";
import moment from "moment";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowLeftTwoTone,
  ArrowUpwardTwoTone,
  ContentCopy,
} from "@mui/icons-material";
import { SxProps } from "@mui/system";
import type { Theme } from "@mui/material/styles/createTheme";

const credentialDurationSeconds = 60 * 60 * 24 * 15; // 15 days

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
              value={cred?.username || ""}
            />
            <CopyTextField
              sx={{ mt: 1 }}
              helperText={"Password"}
              value={cred?.password || ""}
            />
          </Box>
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
  fontSize = 14,
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
          textWrap: "nowrap",
          wrap: "off",
          overflowX: "scroll",

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
              onClick={() => navigator.clipboard.writeText(value)}
            >
              Copy
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
}

const placeholderCredential = {
  username: "<username>",
  password: "<password>",
  timestamp: Date.now(),
};

const clients = ["lighthouse", "lodestar", "nimbus", "prysm", "teku"];
type RPTemplateArgs = {
  client: string;
  username: string;
  password: string;
};

// All of the template overrides start with this prefix.
const rpDefaultTemplate = ({
  client,
  username,
  password,
}: RPTemplateArgs) => `version: "3.7"
services:
  validator:
    environment:
      - "CC_API_ENDPOINT=https://${username}:${password}@${client}.rescuenode.com"`;

const rpPrysmTemplate = ({
  client,
  username,
  password,
}: RPTemplateArgs) => `version: "3.7"
services:
  validator:
    environment:
      - "CC_RPC_ENDPOINT=${client}-grpc.rescuenode.com:443"
      - "VC_ADDITIONAL_FLAGS=--grpc-headers=rprnauth=${username}:${password} --tls-cert=/etc/ssl/certs/ca-certificates.crt"`;

function rpOverridesFor(args: RPTemplateArgs) {
  if (args.client === "prysm") {
    return rpPrysmTemplate(args);
  }
  return rpDefaultTemplate(args);
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
        For more complicated setups that don't use the Smartnode UI, you can{" "}
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
  let [tab, setTab] = useState<"rocketpool" | "solo">(initialTab);
  return (
    <Stack direction="column" sx={sx} spacing={2}>
      <Tabs
        sx={{ width: "100%" }}
        value={tab}
        variant={"fullWidth"}
        textColor={tab === "rocketpool" ? "primary" : "secondary"}
        indicatorColor={tab === "rocketpool" ? "primary" : "secondary"}
        onChange={(e, v) => setTab(v)}
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
