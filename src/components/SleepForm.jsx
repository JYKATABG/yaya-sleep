import { useActionState, useState } from "react";
import "../styles/SleepForm.css";
import { SubmitButton } from "./SubmitButton";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export const SleepForm = () => {
  const { session } = useAuth();

  if (!session) return null;

  const saveSleepAction = async (prevState, formData) => {
    const bedtime = formData.get("bedtime");
    const wakeup = formData.get("wake-up");
    const date = formData.get("date");
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const sleep = calculateSleepDuration(bedtime, wakeup);

    if (!session?.user) {
      toast.error("You have to be logged");
    }

    const newLog = {
      user_id: session?.user?.id,
      date,
      day_name: dayName,
      bedtime,
      wake_up: wakeup,
      duration_min: sleep.totalMinutes,
    };

    const { error } = await supabase.from("sleep_logs").insert(newLog);

    if (error) {
      toast.error("Something went wrong when making new record!");
    } else {
      toast.success("Record successfully added ✨");
    }
  };

  const [state, formAction, isPending] = useActionState(saveSleepAction, null);
  return (
    <>
      <form className="sleep-form" action={formAction}>
        <div className="inputs">
          <div className="input-field">
            <label htmlFor="start-time">Bedtime</label>
            <input
              name="bedtime"
              type="time"
              id="start-time"
              className="time-input"
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="end-time">Wake up</label>
            <input
              type="time"
              name="wake-up"
              id="end-time"
              className="time-input"
              required
            />
          </div>
          <div className="input-field data-field">
            <label htmlFor="log-date">Date</label>
            <input
              type="date"
              name="date"
              id="log-date"
              className="date-input"
              required
            />
          </div>
        </div>
        <SubmitButton isPending={isPending} />
      </form>
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
