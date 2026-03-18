import { useSleep } from "../contexts/SleepContext";
import { Paper, Text, Group } from "@mantine/core";
import "../styles/Stats.css";

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
      <Group justify="space-around" align="center" style={{ flex: 1 }}>
        <div className="stats-circle">
          <div className="stats-value">
            <Text />
            <span className="hours">{avgHours}h</span>
            <span className="minutes">{avgMinutes}m</span>
          </div>
          <h2 className="stats-label">Avg. sleep</h2>
        </div>
      </Group>
    </Paper>
  );
};
