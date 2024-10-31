import { Alert, Typography } from "@mui/material";
import useIsValidSignedMessage from "../hooks/useIsValidSignedMessage";
import type { OperatorInfo } from "../Api";
import useGetOperatorInfo from "../hooks/useGetOperatorInfo";
import React from "react";

export default function OperatorInfoAlert({
  signedMessage,
  operatorType,
}: {
  signedMessage: string;
  operatorType: "solo" | "rocketpool";
}) {
  const { data: isValid } = useIsValidSignedMessage(signedMessage);

  const { data: opInfo } = useGetOperatorInfo({
    signedMessage,
    operatorType,
    enabled: !!isValid,
  });

  if (!opInfo || !isValid) {
    return null;
  }

  return (
    <Alert
      severity="info"
      sx={{ display: "flex", alignItems: "center", mt: 2 }}
    >
      <Typography sx={{ mr: 2, whiteSpace: "pre-line" }} variant="body2">
        {getQuotaText({ operatorInfo: opInfo })}
      </Typography>
    </Alert>
  );
}

function getQuotaText({ operatorInfo }: { operatorInfo: OperatorInfo }) {
  if (operatorInfo === null) {
    return null;
  }

  // See OperatorInfo and QuotaSettings types for full explanation
  // count = total # times per sliding 'window' that access can be requested
  // window = sliding 'window' duration measured in seconds
  // authValidityWindow = credential validity lifetime measured in seconds
  // 86400 seconds = 1 day
  const windowInDays = operatorInfo.quotaSettings.window / 86400;
  const used = operatorInfo.credentialEvents.length;
  const remaining =
    operatorInfo.quotaSettings.count - operatorInfo.credentialEvents.length;

  let usageMsg = `You have not used the Rescue Node in the past ${windowInDays} days.`;
  let activeCredMsg = `You do not currently have an active credential.`;
  let remainingMsg = `You have ${remaining} usages remaining.`;

  if (used === 0) {
    return `${usageMsg}
    ${activeCredMsg}
    ${remainingMsg}`;
  }

  // tz is in locale string format, e.g. 'America/New_York'
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Multiplying by 1000 converts timestamp to milliseconds for working with Date()
  const nextTimestamp =
    operatorInfo.credentialEvents[operatorInfo.credentialEvents.length - 1] *
      1000 +
    operatorInfo.quotaSettings.window * 1000 +
    1000;
  const nextDate = new Date(nextTimestamp).toLocaleString("en-US", {
    timeZone: tz,
  });
  const expiresTimestamp =
    operatorInfo.credentialEvents[0] * 1000 +
    operatorInfo.quotaSettings.authValidityWindow * 1000;
  const expiresDate = new Date(expiresTimestamp).toLocaleString("en-US", {
    timeZone: tz,
  });

  usageMsg = `You have used the Rescue Node ${used} times in the past ${windowInDays} days.`;
  remainingMsg = `You have ${remaining} usages remaining. Your next increase will be at ${nextDate} (${tz}).`;

  if (expiresTimestamp > Date.now()) {
    activeCredMsg = `You currently have an active credential, which will expire at ${expiresDate} (${tz}).`;
  }

  return `${usageMsg}
  ${activeCredMsg}
  ${remainingMsg}`;
}
