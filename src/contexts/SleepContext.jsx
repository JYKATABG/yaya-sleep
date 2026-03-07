import { supabase } from "../supabaseClient";
import { createContext, useContext, useState, useEffect } from "react";

const SleepContext = createContext();

export function SleepProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    const { data, error } = await supabase
      .from("sleep_logs")
      .select("*")
      .order("date", { ascending: true });
    if (!error) setLogs(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const avgSleep =
    logs.length > 0
      ? (
          logs.reduce((acc, log) => acc + log.duration_min, 0) /
          logs.length /
          60
        ).toFixed(1)
      : 0;

  return (
    <SleepContext.Provider
      value={{ logs, loading, avgSleep, refreshLogs: fetchLogs }}
    >
      {children}
    </SleepContext.Provider>
  );
}

export const useSleep = () => useContext(SleepContext);
