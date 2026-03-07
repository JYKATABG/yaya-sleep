import { useSleep } from "../contexts/SleepContext";
import "../styles/Weekbar.css";

export const Weekbar = ({ onDateSelect, selectedDate }) => {
  const { groupedLogs, lastSevenDays, nextWeek, prevWeek } = useSleep();

  return (
    <div className="week-bar">
      <button className="move-weekdays-btn" onClick={prevWeek}>
        {"<"}
      </button>
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
      <button className="move-weekdays-btn" onClick={nextWeek}>
        {">"}
      </button>
    </div>
  );
};
