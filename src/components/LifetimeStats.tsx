import React from "react";
import { alpha, Box, Skeleton, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import useGetLifetimeStats from "../hooks/useGetLifetimeStats";
import type { PeriodStats } from "../Api";

function formatCount(n: number | undefined): string {
  if (n === undefined) {
    return "—";
  }
  return n.toLocaleString();
}

function StatCard({
  title,
  total,
  rocketpool,
  solo,
  loading,
}: {
  title: string;
  total: number | undefined;
  rocketpool: number | undefined;
  solo: number | undefined;
  loading: boolean;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        px: 2.5,
        py: 1.75,
        textAlign: "center",
        borderRadius: 2,
        bgcolor: (t) => alpha(t.palette.common.white, 0.04),
        border: 1,
        borderColor: (t) => alpha(t.palette.common.white, 0.08),
        minWidth: 0,
      }}
    >
      <Typography
        variant="overline"
        color="textSecondary"
        sx={{ letterSpacing: 1.2, lineHeight: 1.2 }}
      >
        {title}
      </Typography>
      {loading ? (
        <Skeleton
          variant="text"
          width={96}
          height={48}
          sx={{ mx: "auto", my: 0.25 }}
        />
      ) : (
        <Typography
          variant="h4"
          sx={{ fontWeight: "fontWeightBold", lineHeight: 1.2, my: 0.5 }}
        >
          {formatCount(total)}
        </Typography>
      )}
      <Stack
        direction="row"
        spacing={1.5}
        useFlexGap
        sx={{ justifyContent: "center", flexWrap: "wrap", mt: 0.5 }}
      >
        <Typography variant="body2" color="primary">
          {loading ? "…" : formatCount(rocketpool)} Rocket Pool
        </Typography>
        <Typography variant="body2" color="textDisabled">
          ·
        </Typography>
        <Typography variant="body2" color="secondary">
          {loading ? "…" : formatCount(solo)} Solo
        </Typography>
      </Stack>
    </Box>
  );
}

function PeriodLine({
  label,
  periods,
  field,
  loading,
}: {
  label: string;
  periods: PeriodStats | undefined;
  field: "accessGranted" | "users";
  loading: boolean;
}) {
  const value =
    loading || !periods
      ? "…"
      : [periods.week, periods.month, periods.year]
          .map((p) => formatCount(p[field]))
          .join(" / ");
  return (
    <Typography variant="body2" color="textSecondary">
      {label} week/month/year:{" "}
      <Box
        component="span"
        sx={{ color: "text.primary", fontWeight: "fontWeightMedium" }}
      >
        {value}
      </Box>
    </Typography>
  );
}

// Lifetime usage totals displayed in the page header.
export default function LifetimeStats({ sx }: { sx?: SxProps<Theme> }) {
  const { data, isLoading, isError } = useGetLifetimeStats();

  // Hide entirely on error so a failing stats endpoint doesn't clutter the header.
  if (isError) {
    return null;
  }

  const accessGranted = data?.accessGranted;
  const users = data?.users;
  const periods = data?.periods;

  return (
    <Stack
      spacing={1.5}
      sx={[
        { width: "100%", maxWidth: 520, alignItems: "center" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ width: "100%" }}
      >
        <StatCard
          title="Access Granted"
          total={
            accessGranted
              ? accessGranted.rocketpool + accessGranted.solo
              : undefined
          }
          rocketpool={accessGranted?.rocketpool}
          solo={accessGranted?.solo}
          loading={isLoading}
        />
        <StatCard
          title="Lifetime Users"
          total={users ? users.rocketpool + users.solo : undefined}
          rocketpool={users?.rocketpool}
          solo={users?.solo}
          loading={isLoading}
        />
      </Stack>
      {(isLoading || periods) && (
        <Stack spacing={0.25} sx={{ alignItems: "center" }}>
          <PeriodLine
            label="Used"
            periods={periods}
            field="accessGranted"
            loading={isLoading}
          />
          <PeriodLine
            label="Unique users"
            periods={periods}
            field="users"
            loading={isLoading}
          />
        </Stack>
      )}
    </Stack>
  );
}
