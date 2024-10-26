import { Alert, Typography } from "@mui/material";
import useIsValidSignedMessage from "../hooks/useIsValidSignedMessage";
import { Api, OperatorInfo } from "../Api";
import { useState } from "react";
import useGetOperatorInfo from "../hooks/useGetOperatorInfo";

export default function OperatorInfoAlert({
  signedMessage,
  operatorType,
}: {
  signedMessage: string;
  operatorType: "solo" | "rocketpool";
}) {
  const { data: isValid } = useIsValidSignedMessage(signedMessage)
  const [opInfo, setOpInfo] = useState<OperatorInfo | null>(null);
  const onError = (error: string) => { console.log(error)}

  useGetOperatorInfo({
    signedMessage: signedMessage,
    operatorType: operatorType,
    enabled: !!isValid,
    onData: setOpInfo,
    onError: onError,
  });
  
  if (!opInfo) {
    return null;
  }

  return (
    <Alert severity="info" sx={{ display: "flex", alignItems: "center", mt: 2 }}>
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

  // 86400 seconds = 1 day
  const windowInDays = operatorInfo.quotaSettings.window / 86400;
  const used = operatorInfo.credentialEvents.length;
  const remaining =
    operatorInfo.quotaSettings.count - operatorInfo.credentialEvents.length;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  var usageMsg = `You have not used the Rescue Node in the past ${windowInDays} days.`;
  var activeCredMsg = `You do not currently have an active credential.`;
  var remainingMsg = `You have ${remaining} usages remaining.`;

  if (used > 0) {
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
  }

  return `${usageMsg}
  ${activeCredMsg}
  ${remainingMsg}`;
}
