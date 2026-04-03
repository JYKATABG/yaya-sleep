import { useSleep } from "../contexts/SleepContext";
import { Paper, Text, Group, Tabs, rem } from "@mantine/core";
import "../styles/Stats.css";
import { IconChartBar, IconChartLine, IconLayoutDashboard } from "@tabler/icons-react";
import { WeeklyChart } from "./layouts/Charts/WeeklyChart";
import { MonthlyEfficiencyChart } from "./layouts/Charts/MonthlyEfficiencyChart";

export const Stats = () => {
  const { avgHours, avgMinutes } = useSleep();
  return (
    <Paper
      shadow="xs"
      p="md"
      radius="md"
      h="100%"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Tabs h="100%" color="#39c9bb" defaultValue="overview" variant="pills"
        styles={{
          root: {
            display: "flex",
            flexDirection: "column",
            height: "100%"
          },
          panel: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center"
          }
        }}
      >
        <Tabs.List mb="md" justify="center" m="lg">
          <Tabs.Tab value="overview" leftSection={<IconLayoutDashboard size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="weekly" leftSection={<IconChartBar size={16} />}>
            Weekly
          </Tabs.Tab>
          <Tabs.Tab value="monthly" leftSection={<IconChartLine size={16} />}>
            Monthly
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <Group justify="space-around" align="center" style={{ minHeight: rem(250) }}>
            <div className="stats-circle">
              <div className="stats-value">
                <span className="hours">{avgHours}h</span>
                <span className="minutes">{avgMinutes}m</span>
              </div>
              <h2 className="stats-label">Avg. sleep</h2>
            </div>
          </Group>
        </Tabs.Panel>

        <Tabs.Panel value="weekly">
          <WeeklyChart />
        </Tabs.Panel>
        <Tabs.Panel value="monthly">
          <MonthlyEfficiencyChart />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};
