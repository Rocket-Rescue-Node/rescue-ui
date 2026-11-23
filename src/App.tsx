import React from "react";
import { Grid, Stack } from "@mui/material";
import Header from "./components/Header";
import RequestAccessSection from "./components/RequestAccessSection";

export function App() {
  // Center the content on the page between two flex-growing columns.
  // On larger screens, make the center column narrower (to keep line-width reasonable).
  return (
    <Grid container>
      <Grid size="grow" />
      <Grid size={{ xs: 12, md: 9, lg: 6 }}>
        <Stack direction="column" sx={{ pt: 5, pb: 5 }} spacing={2}>
          <Header />
          <RequestAccessSection />
        </Stack>
      </Grid>
      <Grid size="grow" />
    </Grid>
  );
}
