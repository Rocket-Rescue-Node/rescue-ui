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
        subheader={cred ? `expires ${moment(cred.timestamp).fromNow()}` : null}
      />
      <CardContent>
        <Stack direction="column" alignItems="center">
          <Box sx={{ width: 300 }}>
            <CopyTextField
              helperText={"username"}
              value={cred?.username || ""}
            />
            <CopyTextField
              helperText={"password"}
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

function RocketPoolInstructions({ cred }: { cred?: AccessCredential }) {
  let { username, password } = cred || placeholderCredential;
  let [client, setClient] = useState<string | null>(null);
  return (
    <Stack direction="column">
      <Typography gutterBottom>
        To use this credential and enable Rescue Node, you’ll edit your
        validator overrides:
      </Typography>
      <Typography
        variant="caption"
        sx={{ textAlign: "center", fontFamily: "monospace" }}
        color="primary"
      >
        ~/.rocketpool/override/validator.yml
      </Typography>
      <Grid container sx={{ mt: 2 }} spacing={1}>
        <Grid item>
          <Tabs
            value={client}
            textColor={"inherit"}
            // orientation={"vertical"}
            variant={"scrollable"}
            scrollButtons="auto"
            onChange={(e, v) => setClient(v)}
          >
            {clients.map((c) => (
              <Tab value={c} label={c} />
            ))}
          </Tabs>
        </Grid>
        <Grid item flexGrow={1}>
          {!client && (
            <Alert sx={{ mt: 3 }} icon={<ArrowUpwardTwoTone />} color="gray">
              <AlertTitle>Select your client</AlertTitle>
              The configuration depends on which client you’re using.
            </Alert>
          )}
          {!!client && (
            <CopyTextField
              sx={{ mt: 3 }}
              helperText={`configuration sample for ${client}`}
              fontSize={10}
              value={rpOverridesFor({ client, username, password })}
            />
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}

function SoloInstructions({ cred }: { cred?: AccessCredential }) {
  return (
    <Stack direction="column">
      <Typography>TODO: give instructions or link to docs</Typography>
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
      {tab === "rocketpool" ? (
        <RocketPoolInstructions cred={cred} />
      ) : (
        <SoloInstructions cred={cred} />
      )}
    </Stack>
  );
}
