import "../styles/HistoryLogs.css";
import { LogCard } from "./LogCard";
import { useSleep } from "../contexts/SleepContext";
import { Weekbar } from "./Weekbar";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Center,
  List,
  Paper,
  rem,
  Stack,
  ThemeIcon,
  Text,
} from "@mantine/core";
import { IconMoonOff, IconZzz } from "@tabler/icons-react";

export const HistoryLogs = () => {
  const { groupedLogs, loading, lastSevenDays, weekOffset, resetToToday } =
    useSleep();
  const todayStr = new Date().toLocaleDateString("sv");
  const [selectedDate, setSelectedDate] = useState(todayStr);

  let isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (weekOffset === 0) {
      setSelectedDate(todayStr);
    } else if (weekOffset !== 0) {
      setSelectedDate(lastSevenDays[0]);
    }
  }, [weekOffset, lastSevenDays]);
  

  const date = new Date(selectedDate);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const handleReset = () => {
    setSelectedDate(todayStr);
    resetToToday();
  };

  if (loading) return <p>Loading logs...</p>;

  return (
    <Paper
      shadow="xs"
      p="md"
      radius="md"
      h="100%"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="date-resetbtn-section">
        <h3 className="log-main-date">{formattedDate}</h3>
        {weekOffset !== 0 && (
          <Button
            bg="#39c9bb"
            color="white"
            radius="10px"
            onClick={handleReset}
          >
            Today
          </Button>
        )}
      </div>
      <Weekbar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
      <List className="history-list">
        {groupedLogs[selectedDate]?.length > 0 ? (
          groupedLogs[selectedDate].map((log) => (
            <LogCard key={log.id} log={log} />
          ))
        ) : (
          <Center py={40}>
            <Stack align="center" gap="xs">
              <ThemeIcon variant="light" size={60} radius="xl" color="gray.4">
                <IconMoonOff
                  style={{ width: rem(30), height: rem(30) }}
                  stroke={1.5}
                />
              </ThemeIcon>

              <Stack gap={4} align="center">
                <Text fw={600} size="lg" c="dimmed">
                  No records for this day
                </Text>
                <Text
                  size="sm"
                  c="gray.5"
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  Time to rest <IconZzz size={14} />
                </Text>
              </Stack>
            </Stack>
          </Center>
        )}
      </List>
    </Paper>
  );
};
