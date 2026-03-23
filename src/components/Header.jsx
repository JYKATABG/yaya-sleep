import { useAuth } from "../contexts/AuthContext";
import {
  Group,
  Text,
  Avatar,
  Menu,
  UnstyledButton,
  rem,
  Stack,
  Container,
  Drawer,
  Input,
  Button,
  Divider,
  Badge,
  Slider,
  TextInput,
} from "@mantine/core";
import {
  IconLogout,
  IconChevronDown,
  IconCalendarStats,
  IconUser,
} from "@tabler/icons-react";
import "../styles/Header.css";
import { useDisclosure } from "@mantine/hooks";
import { useSleep } from "../contexts/SleepContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const Header = () => {
  const { dailySleepGoal, updateSleepGoal } = useSleep();
  const [tempGoal, setTempGoal] = useState(dailySleepGoal);
  const [isEditing, setIsEditing] = useState(false);
  const { session, signOut, user } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const nickname =
    user?.user_metadata.full_name ||
    user?.user_metadata.name ||
    user?.email.split("@gmail.com")[0];

  useEffect(() => {
    if (opened) {
      setTempGoal(dailySleepGoal);
    }
  }, [opened, dailySleepGoal]);

  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

  const handleSave = async (newGoal) => {
    const success = await updateSleepGoal(newGoal);
    if (success) {
      toast.success("Profile updated successfully ✨");
      setIsEditing(false);
    } else {
      toast.error("Failed to update goal. Please try again!");
    }
  };

  console.log(dailySleepGoal);

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
          <>
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
                      src={user?.user_metadata.avatar_url}
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
                  onClick={open}
                >
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
            <Drawer
              opened={opened}
              onClose={close}
              title="My profile"
              position="right"
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Stack display="flex" justify="center" align="center">
                <Avatar
                  src={user?.user_metadata.avatar_url}
                  radius="50%"
                  size="xl"
                  style={{ border: "2px solid #39c9bb" }}
                />
                <TextInput
                  label="Email"
                  value={user?.email}
                  w="100%"
                  disabled
                />
                <TextInput
                  label="Username"
                  value={user?.user_metadata?.full_name}
                  w="100%"
                  disabled={!isEditing}
                />
              </Stack>

              <Divider
                label="Tracking Preferences"
                labelPosition="center"
                my="md"
              />

              <Stack gap={5} my="md">
                <Group justify="center">
                  <Text size="sm" fw={500}>
                    Daily Sleep Goal
                  </Text>
                  <Badge color="#39c9bb" variant="light">
                    {!isEditing ? dailySleepGoal : tempGoal} hours
                  </Badge>
                </Group>
                <Slider
                  value={tempGoal}
                  onChange={setTempGoal}
                  disabled={!isEditing}
                  color="#39c9bb"
                  min={4}
                  max={12}
                  step={0.5}
                  label={(value) => `${value}h`}
                />
              </Stack>
              {!isEditing ? (
                <Button
                  fullWidth
                  onClick={() => {
                    setTempGoal(dailySleepGoal);
                    setIsEditing(true);
                  }}
                >
                  Edit profile
                </Button>
              ) : (
                <Group grow>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setTempGoal(dailySleepGoal);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleSave(tempGoal)}
                  >
                    Save changes
                  </Button>
                </Group>
              )}
            </Drawer>
          </>
        )}
      </Group>
    </Container>
  );
};
