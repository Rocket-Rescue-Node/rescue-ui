import { useState } from "react";
import {
  alpha,
  Box,
  Link,
  Modal,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles/createTheme";
import RocketPoolRequestAccess from "./RocketPoolRequestAccess";
import SoloNodeRequestAccess from "./SoloNodeRequestAccess";
import { AccessCredential } from "../Api";
import CredentialCard from "./CredentialCard";

// Tabbed interface to the request-access forms (one for RP, another for Solo operators).
export default function RequestAccessSection({ sx }: { sx?: SxProps<Theme> }) {
  let [tab, setTab] = useState<"rocketpool" | "solo">("rocketpool");
  let [cred, setCred] = useState<AccessCredential | null>(null);
  return (
    <Paper sx={sx}>
      <Stack direction="column">
        <Box sx={{ p: 3 }}>
          <Typography gutterBottom variant="body1">
            To request access, you'll need to prove you own your validator with
            a signature. This signature process is different for{" "}
            <Link
              onClick={() => setTab("rocketpool")}
              sx={{ cursor: "pointer" }}
              underline="hover"
              color="primary.main"
            >
              rocket pool
            </Link>{" "}
            versus{" "}
            <Link
              onClick={() => setTab("solo")}
              sx={{ cursor: "pointer" }}
              underline="hover"
              color="secondary.main"
            >
              solo node
            </Link>{" "}
            operators.
          </Typography>
        </Box>
        <Tabs
          value={tab}
          // sx={{ml: 16, mr: 16}}
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
        <Box
          sx={(theme) => ({
            p: 3,
            backgroundColor: alpha(
              tab === "rocketpool"
                ? theme.palette.primary.dark
                : theme.palette.secondary.dark,
              0.025,
            ),
          })}
        >
          {tab === "rocketpool" ? (
            <RocketPoolRequestAccess onCredentialCreated={setCred} />
          ) : (
            <SoloNodeRequestAccess onCredentialCreated={setCred} />
          )}
          {/* Show instructions in a modal when we get credentials. */}
          <Modal open={!!cred}
                 sx={{
                   display: "flex",
                   p: 1,
                   alignItems: "center",
                   justifyContent: "center",
                 }}>
            <CredentialCard operatorType={tab} cred={cred!} />
          </Modal>
        </Box>
      </Stack>
    </Paper>
  );
}
