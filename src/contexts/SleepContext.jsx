import { supabase } from "../supabaseClient";
import { createContext, useContext, useState, useEffect } from "react";

const SleepContext = createContext();

export function SleepProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  async function fetchLogs() {
    const { data, error } = await supabase
      .from("sleep_logs")
      .select("*")
      .order("date", { ascending: false });
    if (!error) setLogs(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const lastSevenDays = Array.from({ length: 7 })
    .map((_, i) => {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() - i + weekOffset * 7);
      return newDate.toISOString().split("T")[0];
    })
    .reverse();

  const initialGrouped = lastSevenDays.reduce((acc, date) => {
    acc[date] = [];
    return acc;
  }, {});

  const groupedLogs = logs.reduce((acc, log) => {
    if (acc[log.date]) acc[log.date].push(log);
    return acc;
  }, initialGrouped);

  const totalSleepMinutes =
    logs.length > 0
      ? Math.round(
          logs.reduce((acc, log) => acc + log.duration_min, 0) / logs.length,
        )
      : 0;

  const avgHours = Math.floor(totalSleepMinutes / 60);
  const avgMinutes = totalSleepMinutes % 60;

  const nextWeek = () => setWeekOffset((prev) => prev + 1);
  const prevWeek = () => setWeekOffset((prev) => prev - 1);

  const resetToToday = () => {
    setWeekOffset(0);
  };

  return (
    <SleepContext.Provider
      value={{
        groupedLogs,
        lastSevenDays,
        weekOffset,
        nextWeek,
        prevWeek,
        loading,
        avgHours,
        avgMinutes,
        refreshLogs: fetchLogs,
        resetToToday,
      }}
    >
      {children}
    </SleepContext.Provider>
  );
}

export const useSleep = () => useContext(SleepContext);
