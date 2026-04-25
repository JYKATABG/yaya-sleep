import { supabase } from "../supabaseClient";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";

const SleepContext = createContext();

export function SleepProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const { user } = useAuth();

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
      newDate.setHours(12, 0, 0, 0);
      newDate.setDate(newDate.getDate() + weekOffset * 7 - i);
      return newDate.toLocaleDateString("sv");
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

  const editLog = async (logId, data) => {
    try {
      const { error } = await supabase
        .from("sleep_logs")
        .update(data)
        .eq("id", logId);

      if (error) throw error;

      setLogs((prev) =>
        prev.map((log) => (log.id === logId ? { ...log, ...data } : log)),
      );
      return true;
    } catch (error) {
      console.error("Update error: ", error);
      return false;
    }
  };

  const deleteLog = async (logId) => {
    try {
      const { error } = await supabase
        .from("sleep_logs")
        .delete()
        .eq("id", logId);

      if (error) throw error;

      setLogs((prev) => prev.filter((log) => log.id !== logId));
      return true;
    } catch (error) {
      console.error("Delete error: ", error);
      return false;
    }
  };

  const streakData = useMemo(() => {
    if (!logs || logs.length === 0) return { count: 0, dates: new Set() };

    const sortedLogs = [...logs].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const streakDates = new Set();
    let count = 0;
    let lastDate = null;

    for (const log of sortedLogs) {
      const currentDate = new Date(log.date);

      if (!lastDate) {
        const diff = getDaysDiff(new Date(), currentDate);

        if (diff <= 1) {
          count = 1;
          streakDates.add(log.date);
          lastDate = currentDate;
        } else {
          break;
        }
      } else {
        const diff = getDaysDiff(lastDate, currentDate);
        if (diff === 1) {
          count++;
          streakDates.add(log.date);
          lastDate = currentDate;
        } else if (diff === 0) {
          continue;
        } else {
          break;
        }
      }
    }

    return { count, dates: streakDates };
  }, [logs]);

  return (
    <SleepContext.Provider
      value={{
        logs,
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
        editLog,
        deleteLog,
        streakData,
      }}
    >
      {children}
    </SleepContext.Provider>
  );
}

export const useSleep = () => useContext(SleepContext);

const getDaysDiff = (date1, date2) => {
  const d1 = new Date(date1).setHours(0, 0, 0, 0);
  const d2 = new Date(date2).setHours(0, 0, 0, 0);
  return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
};
