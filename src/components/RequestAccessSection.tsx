import React, { useState } from "react";
import {
  Alert,
  AlertTitle,
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
import { type SxProps } from "@mui/system";
import { type Theme } from "@mui/material/styles/createTheme";
import RocketPoolRequestAccess from "./RocketPoolRequestAccess";
import SoloNodeRequestAccess from "./SoloNodeRequestAccess";
import { type AccessCredential } from "../Api";
import CredentialCard from "./CredentialCard";

// Tabbed interface to the request-access forms (one for RP, another for Solo operators).
export default function RequestAccessSection({ sx }: { sx?: SxProps<Theme> }) {
  const [tab, setTab] = useState<"rocketpool" | "solo">("rocketpool");
  const [cred, setCred] = useState<AccessCredential | null>(null);
  return (
    <Paper sx={sx}>
      <Stack direction="column">
        <Alert severity="info">
          <AlertTitle>Only use for emergencies or maintenance.</AlertTitle>
          You have{" "}
          <Link href="/docs/about.html#limits" color="inherit" target="_blank">
            a limited quota for usage
          </Link>
          . So only enable it when you need it.
        </Alert>
        <Box sx={{ p: 3 }}>
          <Typography gutterBottom variant="body1">
            To request access, you’ll need to prove you own your validator with
            a signature. This signature process is different for{" "}
            <Link
              onClick={() => {
                setTab("rocketpool");
              }}
              sx={{ cursor: "pointer" }}
              underline="hover"
              color="primary.main"
            >
              rocket pool
            </Link>{" "}
            versus{" "}
            <Link
              onClick={() => {
                setTab("solo");
              }}
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
          <Modal
            open={!!cred}
            sx={{
              display: "flex",
              p: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CredentialCard operatorType={tab} cred={cred ?? undefined} />
          </Modal>
        </Box>
      </Stack>
    </Paper>
  );
}
