import { Button, Stack, UnstyledButton, Group, rem, Text } from "@mantine/core";
import { useSleep } from "../contexts/SleepContext";
import "../styles/Weekbar.css";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

const MAIN_COLOR = "#39c9bb";

export const Weekbar = ({ onDateSelect, selectedDate }) => {
  const { groupedLogs, lastSevenDays, nextWeek, prevWeek } = useSleep();

  return (
    <div className="week-bar">
      <Button
        style={{
          backgroundColor: "transparent",
          width: "60px",
          height: "60px",
          color: "black",
        }}
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
          const isSelected = selectedDate === date;
          const dayName = new Intl.DateTimeFormat("en-US", {
            weekday: "narrow",
          }).format(new Date(date));

          return (
            <Stack key={date} align="center" gap={4} style={{ flexShrink: 0 }}>
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
          color: "black",
        }}
        onClick={nextWeek}
      >
        <IconArrowRight />
      </Button>
    </div>
  );
};
