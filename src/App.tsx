import React from "react";
import { Grid, Stack } from "@mui/material";
import Header from "./components/Header";
import RequestAccessSection from "./components/RequestAccessSection";

export function App() {
  // Center the content on the page between two flex-growing columns.
  // On larger screens, make the center column narrower (to keep line-width reasonable).
  return (
    <Grid container>
      <Grid item flexGrow={1} />
      <Grid item lg={6} md={9} xs={12}>
        <Stack direction="column" sx={{ pt: 5, pb: 5 }} spacing={2}>
          <Header />
          <RequestAccessSection />
        </Stack>
      </Grid>
      <Grid item flexGrow={1} />
    </Grid>
  );
}
