import { BarChart } from "@mantine/charts";
import { useSleep } from "../../../contexts/SleepContext";

export const WeeklyChart = () => {
  const { lastSevenDays, groupedLogs } = useSleep();

  const data = lastSevenDays.map((date) => {
    const logs = groupedLogs[date] || [];
    const totalMin = logs.reduce((acc, log) => acc + log.duration_min, 0);

    return {
      date: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
        new Date(date + "T12:00:00"),
      ),
      hours: Number((totalMin / 60).toFixed(2)),
    };
  });

  return (
    <div style={{ flex: 1, width: "100%", minHeight: 250, padding: "10px" }}>
      <BarChart
        h={250}
        data={data}
        dataKey="date"
        series={[{ name: "hours", color: "teal.6", label: "Hours slept" }]}
        tickLine="y"
        gridAxis="xy"
      />
    </div>
  );
};
