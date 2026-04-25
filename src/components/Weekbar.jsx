import { Button, Stack, UnstyledButton, Group, rem, Text } from "@mantine/core";
import { useSleep } from "../contexts/SleepContext";
import "../styles/Weekbar.css";
import {
  IconArrowLeft,
  IconArrowRight,
  IconFlameFilled,
} from "@tabler/icons-react";

const MAIN_COLOR = "#39c9bb";

const getStreakColor = (count) => {
  if (count <= 5) return "gray";
  if (count <= 10) return "#FAFA33";
  if (count <= 20) return "orange";
  if (count <= 50) return "red";
  if (count <= 100) return MAIN_COLOR;
};

export const Weekbar = ({ onDateSelect, selectedDate }) => {
  const { groupedLogs, lastSevenDays, nextWeek, prevWeek, streakData } =
    useSleep();

  return (
    <div className="week-bar">
      <Button
        style={{
          backgroundColor: "transparent",
          width: "60px",
          height: "60px",
          color: " var(--mantine-color-text)",
        }}
        variant="subtle"
        onClick={prevWeek}
      >
        <IconArrowLeft />
      </Button>
      <Group
        justify="center"
        gap="sm"
        wrap="nowrap"
        style={{ overflowX: "auto", paddingBottom: rem(10) }}
      >
        {lastSevenDays.map((date) => {
          const hasData = groupedLogs[date]?.length > 0;
          const isFireDay = streakData.dates.has(date);
          const streakColor = getStreakColor(streakData.count);
          const isSelected = selectedDate === date;
          const dayName = new Intl.DateTimeFormat("en-US", {
            weekday: "narrow",
          }).format(new Date(date + "T00:00:00"));

          return (
            <Stack key={date} align="center" gap={4} style={{ flexShrink: 0 }}>
              <div
                style={{
                  height: rem(18),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isFireDay && (
                  <IconFlameFilled
                    size={18}
                    color={
                      streakColor === "gray"
                        ? "var(--mantine-color-gray-4)"
                        : streakColor
                    }
                  />
                )}
              </div>
              <UnstyledButton
                onClick={() => onDateSelect(date)}
                style={(theme) => ({
                  width: rem(42),
                  height: rem(42),
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  cursor: "pointer",

                  backgroundColor: isSelected
                    ? MAIN_COLOR
                    : theme.colors.gray[1],

                  border:
                    isSelected || hasData
                      ? `2px solid ${MAIN_COLOR}`
                      : "2px solid transparent",

                  "&:hover": {
                    transform: "scale(1.1)",
                    backgroundColor: isSelected
                      ? MAIN_COLOR
                      : theme.colors.gray[2],
                  },
                })}
              >
                <Text
                  fw={700}
                  size="sm"
                  c={isSelected ? "white" : hasData ? MAIN_COLOR : "gray.6"}
                >
                  {dayName}
                </Text>
              </UnstyledButton>

              {hasData && !isSelected && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: MAIN_COLOR,
                  }}
                />
              )}
            </Stack>
          );
        })}
      </Group>
      <Button
        style={{
          backgroundColor: "transparent",
          width: "60px",
          height: "60px",
          color: " var(--mantine-color-text)",
        }}
        onClick={nextWeek}
      >
        <IconArrowRight />
      </Button>
    </div>
  );
};
