import { useSleep } from "../contexts/SleepContext";
import "../styles/Weekbar.css";

export const Weekbar = ({ onDateSelect, selectedDate }) => {
  const { groupedLogs, lastSevenDays } = useSleep();

  return (
    <div className="week-bar">
      {lastSevenDays.map((date) => {
        const hasData = groupedLogs[date]?.length > 0;
        const isSelected = selectedDate === date;

        return (
          <div
            key={date}
            className={`day-circle ${hasData ? "active" : "inactive"} ${isSelected ? "selected" : ""}`}
            onClick={() => onDateSelect(date)}
          >
            {new Intl.DateTimeFormat("en-US", { weekday: "narrow" }).format(
              new Date(date),
            )}
          </div>
        );
      })}
    </div>
  );
};
