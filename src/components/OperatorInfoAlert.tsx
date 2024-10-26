import { Alert, Typography } from "@mui/material";
import { OperatorInfo, OperatorInfoSchema } from "../types/OperatorInfoTypes";
import { useApi } from "../Api";
import useIsValidSignedMessage from "../hooks/useIsValidSignedMessage";

export default function OperatorInfoAlert({
  value,
  operatorType,
}: {
  value: string;
  operatorType: "solo" | "rocketpool";
}) {
  const { data: isValid } = useIsValidSignedMessage(value);
  const { data: opInfo, error } = useApi.getOperatorInfo(
    { body: value, query: { operator_type: operatorType } },
    {
      enabled: !!isValid,
      retry(failureCount, error) {
        if (String(error).includes("timestamp")) {
          return false;
        }
        if (failureCount < 3) {
          return true;
        }
        return false;
      },
    },
  );

  if (!!error) {
    console.log("Error retrieving OperatorInfo:", error);
  }

  if (!opInfo) {
    return null;
  }

  if (!OperatorInfoSchema.safeParse(opInfo?.data).success) {
    console.log("Error validating operatorInfo");
    return null;
  }

  return (
    <Alert severity="info" sx={{ display: "flex", alignItems: "center" }}>
      <Typography sx={{ mr: 2, my: 1, whiteSpace: "pre-line" }} variant="body2">
        {getQuotaText({ value: opInfo.data })}
      </Typography>
    </Alert>
  );
}

function getQuotaText({ value }: { value: OperatorInfo }) {
  if (value === null) {
    return null;
  }

  // 86400 seconds = 1 day
  const windowInDays = value.quotaSettings.window / 86400;
  const used = value.credentialEvents.length;
  const remaining = value.quotaSettings.count - value.credentialEvents.length;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  var usageMsg = `You have not used the Rescue Node in the past ${windowInDays} days.`;
  var activeCredMsg = `You do not currently have an active credential.`;
  var remainingMsg = `You have ${remaining} usages remaining.`;

  if (used > 0) {
    // Multiplying by 1000 converts timestamp to milliseconds for working with Date()
    const nextTimestamp =
      value.credentialEvents[value.credentialEvents.length - 1] * 1000 +
      value.quotaSettings.window * 1000 +
      1000;
    const nextDate = new Date(nextTimestamp).toLocaleString("en-US", {
      timeZone: tz,
    });
    const expiresTimestamp =
      value.credentialEvents[0] * 1000 +
      value.quotaSettings.authValidityWindow * 1000;
    const expiresDate = new Date(expiresTimestamp).toLocaleString("en-US", {
      timeZone: tz,
    });

    usageMsg = `You have used the Rescue Node ${used} times in the past ${windowInDays} days.`;
    remainingMsg = `You have ${remaining} usages remaining. Your next increase will be at ${nextDate} (localized).`;

    if (expiresTimestamp > Date.now()) {
      activeCredMsg = `You currently have an active credential, which will expire at ${expiresDate} (localized).`;
    }
  }

  return `${usageMsg}
  ${activeCredMsg}
  ${remainingMsg}`;
}
