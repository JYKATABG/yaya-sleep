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
  ActionIcon,
  Badge,
  Title,
  Group,
} from "@mantine/core";
import {
  IconMoonOff,
  IconRotateClockwise2,
  IconZzz,
  IconFlameFilled,
} from "@tabler/icons-react";

export const HistoryLogs = () => {
  const {
    groupedLogs,
    loading,
    lastSevenDays,
    weekOffset,
    resetToToday,
    streakData,
  } = useSleep();
  const todayStr = new Date().toLocaleDateString("sv");
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const isFirstRender = useRef(true);

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

  const getStreakColor = (count) => {
    if (count <= 5) return "gray";
    if (count <= 10) return "yellow";
    if (count <= 20) return "orange";
    if (count <= 50) return "red";
    if (count <= 100) return "blue";
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
      <Group
        justify="space-between"
        align="center"
        mb="md"
        className="date-resetbtn-section"
      >
        <Group gap="sm" justify="center" align="center">
          <Title fw={700} size={"md"} order={3}>
            {formattedDate}
          </Title>
          {streakData.count > 0 && (
            <Badge
              variant="filled"
              color={getStreakColor(streakData.count)}
              size="lg"
              leftSection={<IconFlameFilled size={14} />}
            >
              {streakData.count} days streak
            </Badge>
          )}
        </Group>
        {weekOffset !== 0 && (
          <ActionIcon
            onClick={resetToToday}
            variant="light"
            color="blue"
            size="lg"
            radius="xl"
          >
            <IconRotateClockwise2 size={18} />
          </ActionIcon>
        )}
      </Group>
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
