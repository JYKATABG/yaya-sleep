import { Avatar, Group, Menu, rem, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react";

export const UserMenu = ({
  userAvatarUrl,
  nickname,
  onOpenProfile,
  onSignOut,
}) => {
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
