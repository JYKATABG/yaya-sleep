import { useAuth } from "../contexts/AuthContext";
import { Group, Text, Avatar, Menu, UnstyledButton, rem, Stack, Container } from '@mantine/core';
import { IconLogout, IconChevronDown, IconCalendarStats, IconUser } from '@tabler/icons-react';
import "../styles/Header.css";

export const Header = () => {
  const { session, signOut } = useAuth();
  const nickname =
    session?.user.user_metadata.full_name ||
    session?.user.user_metadata.name ||
    session?.user.email.split("@gmail.com")[0];

  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

  return (
    <Container fluid h={70} px="md" w="95%">
      <Group justify="space-between" h="100%">

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

        {session && (
          <Menu shadow="md" width={200} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }}>
            <Menu.Target>
              <UnstyledButton style={{ padding: '5px', borderRadius: '8px', color: "white" }}>
                <Group gap={7}>
                  <Avatar
                    src={session?.user.user_metadata.avatar_url}
                    radius="xl"
                    color="blue"
                    variant="light"
                  >
                    {nickname?.charAt(0).toUpperCase()}
                  </Avatar>
                  <IconChevronDown size={rem(14)} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Application</Menu.Label>
              <Menu.Item leftSection={<IconUser size={14} stroke={1.5} />}>
                Profile
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item
                color="red"
                onClick={signOut}
                leftSection={<IconLogout size={14} stroke={1.5} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Container>
  );
};
