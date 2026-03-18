import { useActionState, useState } from "react";
import "../styles/SleepForm.css";
import { SubmitButton } from "./SubmitButton";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { useSleep } from "../contexts/SleepContext";
import { Button, Paper } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker, TimePicker } from "@mantine/dates";

export const SleepForm = () => {
  const { session, user } = useAuth();
  const { refreshLogs } = useSleep();

  if (!session) return null;

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      bedtime: "",
      wake_up: "",
      date: new Date() || "",
    },
  });

  const handleSubmit = async () => {
    const values = form.getValues();
    const dayName = new Date(values.date).toLocaleDateString("en-US", {
      weekday: "short",
    });

    const sleep = calculateSleepDuration(values.bedtime, values.wake_up);

    if (!user) {
      toast.error("You have to be logged");
    }

    const newLog = {
      user_id: user?.id,
      date: values.date,
      day_name: dayName,
      bedtime: values.bedtime,
      wake_up: values.wake_up,
      duration_min: sleep.totalMinutes,
    };

    const { error } = await supabase.from("sleep_logs").insert(newLog);

    if (error) {
      toast.error("Something went wrong when making new record!");
    } else {
      toast.success("Record successfully added ✨");
      refreshLogs();
    }
  };

  return (
    <>
      <Paper shadow="xs" p="md" radius="md">
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
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "1em",
            margin: "10px 0",
          }}
        >
          <Button
            size="md"
            style={{ flex: 1 }}
            onClick={handleSubmit}
            bg="#39c9bb"
          >
            Save
          </Button>
        </div>
      </Paper>
    </>
  );
};

export const calculateSleepDuration = (bedTime, wakeup) => {
  const [bedHours, bedMinutes] = bedTime.split(":").map(Number);
  const [wakeHours, wakeMinutes] = wakeup.split(":").map(Number);

  const startTotal = bedHours * 60 + bedMinutes;
  const endTotal = wakeHours * 60 + wakeMinutes;

  let duration = endTotal - startTotal;

  if (duration < 0) {
    duration += 24 * 60;
  }

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return { hours, minutes, totalMinutes: duration };
};
