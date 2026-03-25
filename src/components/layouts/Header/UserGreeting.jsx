import { Group, Stack, Text } from "@mantine/core";
import { IconCalendarStats } from "@tabler/icons-react";

export const UserGreeting = ({ nickname, formattedDate }) => {
  return (
    <Stack gap={0}>
      <Text size="lg" fw={700} c="white">
        {nickname}! 👋
      </Text>
      <Group gap={5}>
        <IconCalendarStats size={14} color="white" />
        <Text size="sm" c="white" fw={500}>
          {formattedDate}
        </Text>
      </Group>
    </Stack>
  );
};
