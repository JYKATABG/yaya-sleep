import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Text } from "@mantine/core";
import { calculateSleepDuration } from "./SleepForm";
import { useForm } from "@mantine/form";
import { DatePicker, TimePicker } from "@mantine/dates";
import { useSleep } from "../contexts/SleepContext";
import toast from "react-hot-toast";

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
  const { editLog } = useSleep();
  const { hours, minutes } = calculateSleepDuration(log.bedtime, log.wake_up);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

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

  const isOptimal = hours >= 8;
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
    }

    const hasChanged = JSON.stringify(values) !== JSON.stringify(originalData);

    if (!hasChanged) {
      toast("❗No changes detected");
      close();
      return;
    }

    const result = await editLog(log.id, values);

    if (result) {
      toast.success("Log updated successfully")
      close();
    } else {
      toast.error("Failed to update log");
    }
  };

  const handleDelete = () => {
    console.log(`${log.id} deleted`);
    // todo: delete function
  }

  return (
    <>
      <li className="history-item" onClick={open}>
        <div className="history-info">
          <p className="history-day">Last sleep ({log.day_name})</p>
          <span className="history-range">
            {formatTime(log.bedtime)}ч. - {formatTime(log.wake_up)}ч.
          </span>
          <p className={isOptimal ? "congrats-msg" : "motivation-msg"}>
            {activeMessage}
          </p>
        </div>
        <div className="history-total">
          <span className={badgeClass}>
            {hours}h {minutes}m
          </span>
        </div>
      </li>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size={"md"}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text size="lg">Edit log for {log.day_name}</Text>
          <Button color="red" onClick={openDelete}>Delete record</Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1em",
          }}
        >
          <TimePicker label="Bedtime" {...form.getInputProps("bedtime")} />
          <TimePicker label="Wake Up" {...form.getInputProps("wake_up")} />
          <DatePicker
            style={{ display: "flex", justifyContent: "center" }}
            label="date"
            className="locked-date-picker"
            value={new Date(log.date)}
            onChange={() => { }}
          />
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
