import {
  Avatar,
  Group,
  Menu,
  rem,
  Switch,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconChevronDown,
  IconLogout,
  IconMoonStars,
  IconSun,
  IconUser,
} from "@tabler/icons-react";

export const UserMenu = ({
  userAvatarUrl,
  nickname,
  onOpenProfile,
  onSignOut,
}) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const theme = useMantineTheme();

  const sunIcon = (
    <IconSun size={16} stroke={2.5} color={theme.colors.yellow[4]} />
  );
  const moonIcon = (
    <IconMoonStars size={16} stroke={2.5} color={theme.colors.blue[6]} />
  );

  return (
    <Menu
      shadow="md"
      width={200}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
    >
      <Menu.Target>
        <UnstyledButton
          style={{
            padding: "5px",
            borderRadius: "8px",
            color: "white",
          }}
        >
          <Group gap={7}>
            <Avatar
              src={userAvatarUrl}
              radius="xl"
              color="white"
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
        <Menu.Item
          leftSection={<IconUser size={14} stroke={1.5} />}
          onClick={onOpenProfile}
        >
          Profile
        </Menu.Item>
        <Menu.Item closeMenuOnClick={false}>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Dark mode
            </Text>
            <Switch
              size="md"
              color="dark.4"
              onLabel={sunIcon}
              offLabel={moonIcon}
              checked={computedColorScheme === "dark"}
              onChange={(e) => {
                e.stopPropagation();
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light",
                );
              }}
            />
          </Group>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          color="red"
          onClick={onSignOut}
          leftSection={<IconLogout size={14} stroke={1.5} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
