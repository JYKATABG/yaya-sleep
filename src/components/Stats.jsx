import { useSleep } from "../contexts/SleepContext";
import { Paper, Text, Group, Tabs, rem, Stack, ActionIcon } from "@mantine/core";
import "../styles/Stats.css";
import { IconChartBar, IconChartLine, IconChevronLeft, IconChevronRight, IconLayoutDashboard, IconRotateClockwise2 } from "@tabler/icons-react";
import { WeeklyChart } from "./layouts/Charts/WeeklyChart";
import { MonthlyEfficiencyChart } from "./layouts/Charts/MonthlyEfficiencyChart";
import { useState } from "react";

export const Stats = () => {
  const { avgHours, avgMinutes, prevWeek, nextWeek, weekOffset, resetToToday } = useSleep();

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Paper shadow="xs" p="md" radius="md" h="100%" style={{ display: "flex", flexDirection: "column" }}>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        defaultValue="overview"
        color="#39c9bb"
        variant="pills"
        styles={{
          root: { display: "flex", flexDirection: "column", height: "100%" },
          panel: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
        }}
      >
        <Stack gap="xs" mb="md">
          <Tabs.List justify="center">
            <Tabs.Tab value="overview" leftSection={<IconLayoutDashboard size={16} />}>Overview</Tabs.Tab>
            <Tabs.Tab value="weekly" leftSection={<IconChartBar size={16} />}>Weekly</Tabs.Tab>
            <Tabs.Tab value="monthly" leftSection={<IconChartLine size={16} />}>Monthly</Tabs.Tab>
          </Tabs.List>

          {/* ПОКАЗВАМЕ НАВИГАЦИЯТА САМО АКО АКТИВНИЯТ ТАБ Е "WEEKLY" */}
          <div style={{
            height: rem(40),
            visibility: activeTab === "weekly" ? "visible" : "hidden",
            opacity: activeTab === "weekly" ? 1 : 0,
            transition: "opacity 0.2s ease"
          }}>
            <Group justify="center" gap="xs">
              <ActionIcon onClick={prevWeek} variant="subtle" color="gray" size="lg" radius="xl">
                <IconChevronLeft size={20} />
              </ActionIcon>

              <Text size="sm" fw={600} c="dimmed" style={{ minWidth: rem(100), textAlign: 'center' }}>
                {weekOffset === 0 ? "This Week" :
                  weekOffset === -1 ? "Last Week" :
                    `${Math.abs(weekOffset)} Weeks Ago`}
              </Text>

              <ActionIcon
                onClick={nextWeek}
                variant="subtle"
                color="gray"
                size="lg"
                radius="xl"
                disabled={weekOffset === 0}
              >
                <IconChevronRight size={20} />
              </ActionIcon>

              {weekOffset !== 0 && (
                <ActionIcon onClick={resetToToday} variant="light" color="blue" size="lg" radius="xl">
                  <IconRotateClockwise2 size={18} />
                </ActionIcon>
              )}
            </Group>
          </div>
        </Stack>

        <Tabs.Panel value="overview">
          <div className="stats-circle">
            <div className="stats-value">
              <span className="hours">{avgHours}h</span>
              <span className="minutes">{avgMinutes}m</span>
            </div>
            <h2 className="stats-label">Avg. sleep</h2>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="weekly" style={{ width: '100%' }}>
          <WeeklyChart />
        </Tabs.Panel>

        <Tabs.Panel value="monthly" style={{ width: '100%' }}>
          <MonthlyEfficiencyChart />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};
