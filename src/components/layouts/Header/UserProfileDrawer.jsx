import imageCompression from "browser-image-compression";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Group,
  Text,
  Avatar,
  Menu,
  UnstyledButton,
  Stack,
  Drawer,
  Button,
  Divider,
  Badge,
  Slider,
  TextInput,
  Transition,
  Box,
  Overlay,
  Modal,
  FileButton,
} from "@mantine/core";
import { IconPencil, IconPhoto, IconLink } from "@tabler/icons-react";
import { useAuth } from "../../../contexts/AuthContext";

export const UserProfileDrawer = ({ opened, onClose }) => {
  const {
    updateProfile,
    updateAvatar,
    username,
    avatarUrl,
    dailySleepGoal,
    user,
  } = useAuth();

  const [tempGoal, setTempGoal] = useState(dailySleepGoal);
  const [isSaving, setIsSaving] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [isEditing, setIsEditing] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const [urlModalOpened, setUrlModalOpened] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  useEffect(() => {
    if (opened) {
      setTempGoal(dailySleepGoal);
      setTempUsername(username);
    }
  }, [opened, dailySleepGoal, username]);

  const handleSave = async () => {
    const goalChanged = tempGoal !== dailySleepGoal;
    const usernameChanged = username !== tempUsername;

    if (!goalChanged && !usernameChanged) {
      setIsEditing(false);
      return;
    }

    if (usernameChanged && tempUsername.trim().length === 0) {
      return toast.error("Please enter a valid username");
    }

    if (usernameChanged && tempUsername.length > 20) {
      return toast.error("Username is too long (max 20 chars)");
    }

    setIsSaving(true);

    try {
      const updates = {};
      if (usernameChanged) updates.full_name = tempUsername;
      if (goalChanged) updates.daily_goal = tempGoal;

      const success = await updateProfile(updates);

      if (success) {
        toast.success("Profile updated! ✨");
        setIsEditing(false);
      } else {
        toast.error("Error saving changes");
      }
    } catch (error) {
      console.error("Unexpected error occured ", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid format! Please provide image (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large (max 2mb)");
      return;
    }

    setIsSaving(true);

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        initialQuality: 0.6,
        alwaysKeepResolution: false,
      };

      const compressedFile = await imageCompression(file, options);

      const publicUrl = await updateAvatar(compressedFile, user.id);

      if (publicUrl) {
        await updateProfile({ avatar_url: publicUrl });
        toast.success("Image is optimized and uploaded!");
      }
    } catch (error) {
      toast.error("Error while processing image");
    } finally {
      setIsSaving(false);
    }
  };

  const validateImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;

      img.onload = () => resolve(true);

      img.onerror = () => resolve(false);
    });
  };

  const handleUrlSubmit = async () => {
    const url = newAvatarUrl.trim();
    if (!url) return;

    setIsSaving(true);

    const isValid = await validateImageUrl(url);

    if (!isValid) {
      toast.error("The link does not appear to be supported");
      setIsSaving(false);
      return;
    }

    const success = await updateProfile({ avatar_url: newAvatarUrl.trim() });

    if (success) {
      toast.success("Image was updated with link");
      setUrlModalOpened(false);
      setNewAvatarUrl("");
    }

    setIsSaving(false);
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="My profile"
      position="right"
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Stack display="flex" justify="center" align="center">
        <Menu
          shadow="md"
          width={200}
          position="bottom"
          closeOnItemClick={false}
        >
          <Menu.Target>
            <UnstyledButton
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {}}
              style={{
                position: "relative",
                borderRadius: "50%",
                overflow: "hidden",
                width: "fit-content",
              }}
            >
              <Avatar
                src={avatarUrl}
                radius="50%"
                size="xl"
                style={{ border: "2px solid #39c9bb" }}
              />

              <Transition mounted={isHovered} transition="fade" duration={200}>
                {(styles) => (
                  <Box
                    style={{
                      ...styles,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <Overlay color="#000" opacity={0.4} blur={2} zIndex={1} />
                    <IconPencil size={30} color="white" style={{ zIndex: 2 }} />
                  </Box>
                )}
              </Transition>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Profile Picture</Menu.Label>
            <FileButton
              onChange={handleFileUpload}
              accept="image/png,image/jpeg"
            >
              {(props) => (
                <Menu.Item {...props} leftSection={<IconPhoto size={14} />}>
                  Upload File
                </Menu.Item>
              )}
            </FileButton>
            <Menu.Item
              leftSection={<IconLink size={14} />}
              onClick={() => setUrlModalOpened(true)}
            >
              Paste Image Link
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <TextInput label="Email" value={user?.email} w="100%" disabled />
        <TextInput
          label="Username"
          defaultValue={tempUsername}
          w="100%"
          disabled={!isEditing}
          onChange={(e) => setTempUsername(e.currentTarget.value)}
        />
      </Stack>

      <Modal
        opened={urlModalOpened}
        onClose={() => setUrlModalOpened(false)}
        title="Change Avatar via Link"
        centered
      >
        <TextInput
          label="Image URL"
          placeholder="https://..."
          value={newAvatarUrl}
          onChange={(e) => setNewAvatarUrl(e.currentTarget.value)}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setUrlModalOpened(false)}>
            Cancel
          </Button>
          <Button bg="#39c9bb" onClick={handleUrlSubmit}>
            Update
          </Button>
        </Group>
      </Modal>

      <Divider label="Tracking Preferences" labelPosition="center" my="md" />

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
          bg="#39c9bb"
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
            color="red"
            onClick={() => {
              setTempGoal(dailySleepGoal);
              setIsEditing(false);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            color="#39c9bb"
            loading={isSaving}
            loaderProps={{ type: "dots" }}
            onClick={handleSave}
          >
            Save changes
          </Button>
        </Group>
      )}
    </Drawer>
  );
};
