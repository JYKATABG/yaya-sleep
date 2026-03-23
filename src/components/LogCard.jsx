import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  Modal,
  Button,
  Text,
  ListItem,
  Group,
  Paper,
  ThemeIcon,
  Stack,
  Badge,
  rem,
} from "@mantine/core";
import { calculateSleepDuration } from "./SleepForm";
import { useForm } from "@mantine/form";
import { DatePicker, TimePicker } from "@mantine/dates";
import { useSleep } from "../contexts/SleepContext";
import toast from "react-hot-toast";
import { IconClock, IconMoonStars } from "@tabler/icons-react";

const CONGRATS_MESSAGES = [
  "Great job! 🌟 Fully charged!",
  "Sleep queen! ✨ You nailed it!",
  "Energy levels: 100% 🔋",
  "Glow up in progress... Done! 💅",
  "You're a sleeping pro! 🏆",
  "Fresh and ready to conquer! 🔥",
  "Sleep level: Master. Zen level: Infinite. 🧘‍♀️",
  "You didn't just sleep, you performed a miracle! ✨",
  "Sleeping beauty called... she's jealous. 💅",
  "Congratulations! You’ve officially escaped the Zombie Zone. 🧟‍♂️❌",
  "Your brain cells are throwing a party right now! 🥳",
  "8 hours? You’re basically a professional athlete of rest. 🏆",
  "Legend has it, you’re now 110% more powerful. 🔥",
  "Waking up like a Disney princess/prince. 🐦🎶",
  "You’ve reached the 'Golden Pillow' achievement! 🎖️",
  "Reality is loading... please wait, high energy detected! 🔌",
];

const MOTIVATIONAL_MESSAGES = [
  "Small steps lead to big changes! 👣",
  "Every hour of rest counts! 🔋",
  "Consistency is the key to success! 🔑",
  "Loading energy for a great day... ⏳",
  "You're building a great habit! 🌱",
  "Keep going, you're doing great! ✨",
  "Coffee: Required. Attitude: Optional. ☕️🚀",
  "You're doing great for someone who's basically a human-battery at 20%. 🔋",
  "Warning: Low fuel, but high spirit! Let's go! ✈️",
  "Tonight: A date with your bed. Don't be late! 🛌❤️",
  "Nap-time is not a crime. Just saying... 👀",
  "Your bed misses you already. It’s a tragic love story. 💔",
  "Stay strong! The weekend (or your next sleep) is coming. 🛡️",
  "You're a warrior. A tired warrior, but still a warrior! ⚔️😴",
  "Focus on the coffee, not the chaos. You got this! ☕️✨",
  "Running on caffeine and dreams today. Mostly caffeine. 🏃‍♀️💨",
];

export const LogCard = ({ log }) => {
  const { editLog, deleteLog, dailySleepGoal } = useSleep();
  const { hours, minutes } = calculateSleepDuration(log.bedtime, log.wake_up);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const isMobile = useMediaQuery("(max-width: 500px)");
  const MAIN_COLOR = "#39c9bb";

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.slice(0, 5);
  };

  const getPersistentMessage = (id, messagesArr) => {
    if (!id) return messagesArr[0];
    const idStr = String(id);
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      const char = idStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash | 0;
    }
    const index = Math.abs(hash) % messagesArr.length;

    return messagesArr[index];
  };

  const isOptimal = hours >= dailySleepGoal;
  const activeMessage = isOptimal
    ? getPersistentMessage(log?.id, CONGRATS_MESSAGES)
    : getPersistentMessage(log?.id, MOTIVATIONAL_MESSAGES);

  let badgeClass = "duration-badge";
  if (hours < 6) {
    badgeClass += " low-sleep";
  } else {
    badgeClass += " optimal-sleep";
  }

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      bedtime: log.bedtime || "",
      wake_up: log.wake_up || "",
    },
  });

  const handleEdit = async () => {
    const values = form.getValues();

    const originalData = {
      bedtime: log.bedtime,
      wake_up: log.wake_up,
    };

    const hasChanged = JSON.stringify(values) !== JSON.stringify(originalData);

    if (!hasChanged) {
      toast("❗No changes detected");
      close();
      return;
    }

    const result = await editLog(log.id, values);

    if (result) {
      toast.success("Log updated successfully");
      close();
    } else {
      toast.error("Failed to update log");
    }
  };

  const handleDelete = async () => {
    const result = await deleteLog(log.id);

    if (result) {
      toast.success("Log deleted successfully");
    } else {
      toast.error("Failed to delete log");
    }
  };

  return (
    <>
      <Paper
        withBorder
        p="md"
        radius="md"
        mb="sm"
        shadow="xs"
        onClick={open}
        style={{
          cursor: "pointer",
          transition: "all 0.2s ease",
          ":hover": {
            backgroundColor: "#fcfdfd",
          },
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = MAIN_COLOR;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "#dee2e6";
        }}
      >
        <Group
          justify="space-between"
          align="center"
          wrap={isMobile ? "wrap" : "nowrap"}
        >
          <Group gap="md" style={{ flex: 1 }}>
            <ThemeIcon
              variant="light"
              size={isMobile ? "lg" : "xl"}
              radius="md"
              style={{
                backgroundColor: isOptimal ? "#e6f7f6" : "#fff5f5",
                color: isOptimal ? MAIN_COLOR : "#fa5252",
              }}
            >
              <IconMoonStars size={isMobile ? 20 : 24} />
            </ThemeIcon>

            <Stack gap={2}>
              <Text
                size="xs"
                fw={700}
                c="dimmed"
                style={{ textTransform: "uppercase", letterSpacing: rem(0.5) }}
              >
                Last sleep ({log.day_name})
              </Text>

              <Group gap={5}>
                <IconClock size={14} color="gray" />
                <Text size={isMobile ? "sm" : "md"} fw={600}>
                  {formatTime(log.bedtime)}ч. – {formatTime(log.wake_up)}ч.
                </Text>
              </Group>

              <Text
                size="xs"
                fw={600}
                style={{
                  fontStyle: "italic",
                  color: isOptimal ? MAIN_COLOR : "#fa5252",
                }}
              >
                {activeMessage}
              </Text>
            </Stack>
          </Group>

          <Stack
            align={isMobile ? "flex-start" : "flex-end"}
            gap={0}
            mt={isMobile ? "xs" : 0}
            pl={isMobile ? 54 : 0}
          >
            <Badge
              variant="filled"
              size="lg"
              radius="sm"
              style={{
                backgroundColor: isOptimal ? MAIN_COLOR : "#fa5252",
                color: "white",
              }}
              h={32}
            >
              <Text size="sm" fw={800} span>
                {hours}h {minutes}m
              </Text>
            </Badge>

            {isOptimal && (
              <Text size="10px" fw={700} mt={4} style={{ color: MAIN_COLOR }}>
                OPTIMAL DURATION
              </Text>
            )}
          </Stack>
        </Group>
      </Paper>
      <Modal opened={opened} onClose={close} centered size={"md"} key={log?.id}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text size="lg">Edit log for {log.day_name}</Text>
          <Button color="red" onClick={openDelete}>
            Delete record
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1em",
          }}
        >
          <TimePicker
            label="Bedtime"
            {...form.getInputProps("bedtime")}
            key={form.key("bedtime")}
          />
          <TimePicker
            label="Wake Up"
            {...form.getInputProps("wake_up")}
            key={form.key("wake_up")}
          />
          <Text size="sm" c="dimmed">
            Date: {new Date(log.date).toLocaleDateString()}
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1em",
            margin: "10px 0",
          }}
        >
          <Button style={{ flex: "1" }} size="md" onClick={handleEdit}>
            Save
          </Button>
          <Button style={{ flex: "1" }} size="md" onClick={close}>
            Close
          </Button>
        </div>
      </Modal>

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Confirm deletion"
        centered
        size="sm"
      >
        <p>
          Are you sure you want to delete this log? This action cannot be
          undone.
        </p>
        <div style={{ display: "flex", gap: "10px", margin: "20px" }}>
          <Button variant="outline" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Yes, delete it
          </Button>
        </div>
      </Modal>
    </>
  );
};
