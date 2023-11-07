import { Box, Button, Link, Stack, Typography } from "@mui/material";
import Logo from "./Logo";
import { ChevronRight } from "@mui/icons-material";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles/createTheme";

// The top portion of the page.
export default function Header({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Stack sx={sx} direction="column" alignItems="center">
      <Box sx={{ m: 2 }}>
        <Logo size={64} />
      </Box>
      <Typography variant="h3" fontWeight="fontWeightBold">
        Rocket Rescue Node
      </Typography>
      <Stack direction="row" spacing={2}>
        <Link
          variant="h6"
          color="text.secondary"
          href="https://rescuenode.com/"
        >
          About
        </Link>
        <Link variant="h6" color="text.secondary" target="_blank" href="#TODO">
          Donate
        </Link>
        <Link variant="h6" color="text.secondary" target="_blank" href="#TODO">
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
      <Typography
        variant="h6"
        sx={{ m: 2, textAlign: "center", maxWidth: 500 }}
      >
        A community-run, trust-minimized, and secured
        <br />
        fallback node for emergencies and maintenance.
      </Typography>
      <Button
        component={Link}
        href="#"
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
