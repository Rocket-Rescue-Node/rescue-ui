import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import { AccessCredential } from "../Api";

const credentialDurationSeconds = 60 * 60 * 24 * 15; // 15 days

export default function CredentialCard({
  cred,
  operatorType,
}: {
  cred: AccessCredential;
  operatorType: "solo" | "rocketpool";
}) {
  // TODO: include detailed instructions based on the `operatorType`
  return (
    <Card>
      <CardHeader
        title="Credential Acquired"
        subheader={`expires ${new Date(1000 * (cred.timestamp + credentialDurationSeconds))}`}
      />
      <CardContent>
        <code>
          <pre>{JSON.stringify(cred, null, 2)}</pre>
        </code>
          <Typography>TODO: explain how to use it</Typography>
      </CardContent>
    </Card>
  );
}
