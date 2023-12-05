import { Address, useEnsName } from "wagmi";
import { Chip } from "@mui/material";

// Display an address as a clickable chip.
export default function AddressChip({
  address,
  color = "default",
}: {
  address: Address;
  color?: "default" | "primary" | "secondary";
}) {
  const { data: ensName } = useEnsName({ address });
  return (
    <Chip
      color={color}
      component="a"
      href={`https://etherscan.io/address/${ensName || address}`}
      target={"_blank"}
      // variant="outlined"
      clickable
      label={
        ensName ?? `${address.substring(0, 8)}...${address.substring(42 - 6)}`
      }
    />
  );
}
