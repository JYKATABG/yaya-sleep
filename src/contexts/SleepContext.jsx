import { supabase } from "../supabaseClient";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const SleepContext = createContext();

export function SleepProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [dailySleepGoal, setDailySleepGoal] = useState(8);
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

  useEffect(() => {
    const savedGoal = user?.user_metadata?.daily_goal;
    if (savedGoal) {
      setDailySleepGoal(savedGoal);
    }
  }, [user]);

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

  const updateSleepGoal = async (newGoal) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { daily_goal: newGoal },
      });

      if (error) throw error;

      setDailySleepGoal(newGoal);
      return true;
    } catch (error) {
      console.error("Error updating goal: ", error);
      return false;
    }
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
        editLog,
        deleteLog,
        dailySleepGoal,
        setDailySleepGoal,
        updateSleepGoal,
      }}
    >
      {children}
    </SleepContext.Provider>
  );
}

export const useSleep = () => useContext(SleepContext);
