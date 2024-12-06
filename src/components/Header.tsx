import React from "react";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import Logo from "./Logo";
import { ChevronRight } from "@mui/icons-material";
import { type SxProps } from "@mui/system";
import { type Theme } from "@mui/material/styles/createTheme";

// The top portion of the page.
export default function Header({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Stack sx={sx} direction="column" alignItems="center">
      <Box sx={{ m: 2 }}>
        <Logo size={64} />
      </Box>
      <Typography variant="h4" fontWeight="fontWeightBold">
        Rocket Rescue Node
      </Typography>
      <Typography
        sx={{ opacity: 0.8, m: 0, textAlign: "center", maxWidth: 500 }}
      >
        <i>
          Built and sponsored by the
          <span> </span>
          <Link target="_blank" href="https://dao.rocketpool.net/">
            Rocket Pool DAO
          </Link>
          . Maintained by
          <span> </span>
          <Link target="_blank" href="https://ethstaker.cc/">
            EthStaker
          </Link>
          .
        </i>
      </Typography>
      <Typography
        variant="h6"
        sx={{ m: 2, textAlign: "center", maxWidth: 500 }}
      >
        A community-run, trust-minimized, and secured fallback node for
        emergencies and maintenance.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Link
          variant="h6"
          color="text.secondary"
          target="_blank"
          href="/docs/about.html"
        >
          About
        </Link>
        <Link
          variant="h6"
          color="text.secondary"
          target="_blank"
          href="/docs/donate.html"
        >
          Donate
        </Link>
        <Link
          variant="h6"
          color="text.secondary"
          target="_blank"
          href="/docs/faq.html"
        >
          FAQ
        </Link>
        <Link
          variant="h6"
          color="text.secondary"
          target="_blank"
          href="https://stats.rescuenode.com/"
        >
          Stats
        </Link>
      </Stack>
      <Button
        component={Link}
        href="https://youtu.be/nePcIUq684k"
        target="_blank"
        variant="text"
        endIcon={<ChevronRight />}
        color="gray"
        size="large"
      >
        View Tutorial
      </Button>
    </Stack>
  );
}
