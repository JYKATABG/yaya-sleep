import "../styles/HistoryLogs.css";
import { LogCard } from "./LogCard";
import { useSleep } from "../contexts/SleepContext";
import { Weekbar } from "./Weekbar";
import { useEffect, useState } from "react";

export const HistoryLogs = () => {
  const { groupedLogs, loading, lastSevenDays, weekOffset, resetToToday } =
    useSleep();
  const [selectedDate, setSelectedDate] = useState(lastSevenDays[0]);

  const date = new Date(selectedDate);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  useEffect(() => {
    setSelectedDate(lastSevenDays[0]);
  }, [weekOffset]);

  if (loading) return <p>Loading logs...</p>;

  return (
    <section className="history-section">
      <div className="date-resetbtn-section">
        <h3 className="log-main-date">{formattedDate}</h3>
        {weekOffset !== 0 && (
          <button className="today-btn" onClick={resetToToday}>
            Today
          </button>
        )}
      </div>
      <Weekbar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
      <ul className="history-list">
        {groupedLogs[selectedDate]?.length > 0 ? (
          groupedLogs[selectedDate].map((log) => (
            <LogCard key={log.id} log={log} />
          ))
        ) : (
          <p className="empty-log">No records for this day</p>
        )}
      </ul>
    </section>
  );
};
