import { useActionState, useState } from "react"
import "../styles/SleepForm.css"
import { SubmitButton } from "./SubmitButton";

export const SleepForm = () => {

    const saveSleepAction = (prevState, formData) => {
        const bedTime = formData.get("bedtime");
        const wakeup = formData.get("wake-up");
        const date = formData.get("date");

        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        console.log(dayName);

        const sleep = calculateSleepDuration(bedTime, wakeup);
        console.log(sleep);
    }

    const calculateSleepDuration = (bedTime, wakeup) => {
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
    }

    const [state, formAction, isPending] = useActionState(saveSleepAction, null);
    return (
        <>
            <form className="sleep-form" action={formAction}>
                <div className="inputs">
                    <div className="input-field">
                        <label htmlFor="start-time">Bedtime</label>
                        <input name="bedtime" type="time" id="start-time" className="time-input" required />
                    </div>
                    <div className="input-field">
                        <label htmlFor="end-time">Wake up</label>
                        <input type="time" name="wake-up" id="end-time" className="time-input" required />
                    </div>
                    <div className="input-field data-field">
                        <label htmlFor="log-date">Date</label>
                        <input type="date" name="date" id="log-date" className="date-input" required />
                    </div>
                </div>
                <SubmitButton isPending={isPending} />
            </form>
        </>
    )
}